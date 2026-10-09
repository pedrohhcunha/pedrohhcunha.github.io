// Gera index.html, sitemap.xml e llms.txt a partir de src/.
// Os artigos vêm do RSS do blog da Epicora; se o RSS falhar, usa o último
// cache (src/artigos.json) para o site nunca sair sem a seção.
//
//   node build.mjs
//
// Roda sozinho toda segunda no GitHub Actions (.github/workflows/publicar.yml).

import { readFile, writeFile } from 'node:fs/promises';
import {
  SITE, EMAIL, PERFIS, GRUPOS, TRABALHO, DEPOIMENTOS, LOGOS, FORMATOS, TEMAS, TRAJETORIA, STACK,
} from './src/dados.mjs';

const RSS = 'https://epicora.com.br/rss.xml';
const QTD_ARTIGOS = 5;
const CACHE = new URL('./src/artigos.json', import.meta.url);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const desesc = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&')
  .trim();
const tag = (xml, nome) => {
  const m = xml.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`));
  return m ? desesc(m[1]) : '';
};

async function artigos() {
  try {
    const res = await fetch(RSS, { headers: { 'user-agent': 'pedrohhcunha.github.io build' } });
    if (!res.ok) throw new Error(`RSS respondeu ${res.status}`);
    const xml = await res.text();
    const itens = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => ({
      titulo: tag(it, 'title'),
      link: tag(it, 'link'),
      data: new Date(tag(it, 'pubDate')).toISOString().slice(0, 10),
      tema: tag(it, 'category'),
      resumo: tag(it, 'description'),
      autor: tag(it, 'dc:creator'),
    }));
    const meus = itens.filter((a) => !a.autor || /pedro/i.test(a.autor));
    if (!meus.length) throw new Error('RSS sem artigos');
    meus.sort((a, b) => b.data.localeCompare(a.data));
    await writeFile(CACHE, JSON.stringify(meus, null, 2) + '\n');
    return meus;
  } catch (erro) {
    console.warn(`! RSS indisponível (${erro.message}); usando src/artigos.json`);
    return JSON.parse(await readFile(CACHE, 'utf8'));
  }
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const dataCurta = (iso) => {
  const [a, m, d] = iso.split('-');
  return `${d} ${MESES[Number(m) - 1]} ${a}`;
};
const hojeBrasilia = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);

const seta = '<svg><use href="#seta"/></svg>';
const sai = '<svg><use href="#sai"/></svg>';
const caseUrl = (slug) => `https://epicora.com.br/cases/${slug}`;

// Logos duas vezes seguidas: o marquee anda 50% e emenda sem salto.
const umaVolta = LOGOS.map(([arq, nome]) => `          <img src="assets/logos/${arq}.png" alt="${esc(nome)}" loading="lazy" height="34">`).join('\n');
const htmlLogos = `${umaVolta}\n${umaVolta.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"')}`;

const contagem = Object.fromEntries(Object.keys(GRUPOS).map((g) => [g, TRABALHO.filter((t) => t.grupo === g).length]));
const htmlFiltros = [
  `          <button type="button" class="filtro" data-filtro="todos" aria-pressed="true">Todos <sup>${TRABALHO.length}</sup></button>`,
  ...Object.entries(GRUPOS).map(([g, nome]) => `          <button type="button" class="filtro" data-filtro="${g}" aria-pressed="false">${esc(nome)} <sup>${contagem[g]}</sup></button>`),
].join('\n');

const htmlTrabalho = TRABALHO.map((t, i) => `          <li class="item" data-grupo="${t.grupo}" data-img="assets/cases/${t.slug}.webp">
            <a href="${caseUrl(t.slug)}">
              <span class="n mono">${String(i + 1).padStart(2, '0')}</span>
              <span class="nome">${esc(t.cliente)}<small>${esc(t.setor)} · ${esc(GRUPOS[t.grupo])}</small></span>
              <img class="thumb" src="assets/cases/${t.slug}.webp" alt="" loading="lazy" width="96" height="60">
              <span class="num-r"><strong>${esc(t.valor)}</strong><span>${esc(t.rotulo)}</span></span>
              ${sai}
            </a>
          </li>`).join('\n');

const htmlDepoimentos = DEPOIMENTOS.map((d, i) => `            <figure class="depo-item${i === 0 ? ' on' : ''}">
              <blockquote>${esc(d.texto)}</blockquote>
              <figcaption><b>${esc(d.autor)}</b> · ${esc(d.cargo)}</figcaption>
            </figure>`).join('\n');

const htmlFormatos = FORMATOS.map((f, i) => `            <article class="prancha formato rv" style="--d:${i}">
              <div><span class="dur mono">${esc(f.duracao)}</span><h3>${esc(f.nome)}</h3></div>
              <div><p><b>Para quem:</b> ${esc(f.para)}</p><p><b>Sai com:</b> ${esc(f.leva)}</p></div>
            </article>`).join('\n');

const htmlTemas = TEMAS.map((t) => t.link
  ? `              <li><a href="${t.link}">${esc(t.tema)}${sai}</a></li>`
  : `              <li><span>${esc(t.tema)}</span></li>`).join('\n');

const htmlArtigos = (lista) => lista.map((a, i) => `          <a class="prancha artigo rv${i === 0 ? ' destaque' : ''}" style="--d:${i % 3}" href="${esc(a.link)}">
            <span class="meta"><span class="mono">${dataCurta(a.data)}</span>${a.tema ? `<span class="chip">${esc(a.tema)}</span>` : ''}</span>
            <h3>${esc(a.titulo)}</h3>
            <p>${esc(a.resumo)}</p>
            <span class="ler">Ler no blog da Epicora ${seta}</span>
          </a>`).join('\n');

const htmlTrajetoria = TRAJETORIA.map((t) => `              <li class="parada${t.atual ? ' atual' : ''}">
                <span class="quando mono">${esc(t.quando)}</span>
                <h3>${esc(t.titulo)}</h3>
                <p>${esc(t.texto)}</p>
              </li>`).join('\n');

const htmlStack = STACK.map(([area, itens]) => `              <div class="stack-linha"><span class="mono">${esc(area)}</span><div>${itens.map((i) => `<span>${esc(i)}</span>`).join('')}</div></div>`).join('\n');

function jsonld(hoje, lista) {
  const pessoa = {
    '@type': 'Person',
    '@id': `${SITE}#pedro`,
    name: 'Pedro Cunha',
    alternateName: 'Pedro Henrique Hoffmann da Cunha',
    givenName: 'Pedro',
    familyName: 'Cunha',
    url: SITE,
    email: `mailto:${EMAIL}`,
    image: `${SITE}assets/img/pedro-720.webp`,
    jobTitle: 'CTO (Diretor de Tecnologia)',
    description: 'CTO e sócio da Epicora Software House, em Chapecó (SC). Lidera o time que constrói software sob medida e dá treinamentos e palestras de IA aplicada a negócios.',
    worksFor: { '@id': 'https://epicora.com.br/#organization' },
    address: { '@type': 'PostalAddress', addressLocality: 'Chapecó', addressRegion: 'SC', addressCountry: 'BR' },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Faculdade SENAI Santa Catarina' },
      { '@type': 'EducationalOrganization', name: 'SESI SENAI Chapecó' },
    ],
    knowsAbout: [
      'Inteligência artificial aplicada a negócios', 'Agentes de IA', 'Treinamento de IA para empresas',
      'Software sob medida', 'Arquitetura de software', 'Desenvolvimento front-end', 'Desenvolvimento de aplicativos',
      'Gestão de times de tecnologia',
    ],
    sameAs: [PERFIS.linkedin, PERFIS.instagram, PERFIS.youtube, PERFIS.github, PERFIS.autor],
  };
  const epicora = {
    '@type': 'Organization',
    '@id': 'https://epicora.com.br/#organization',
    name: 'Epicora Software House',
    url: 'https://epicora.com.br',
  };
  const palestra = {
    '@type': 'EducationEvent',
    '@id': `${SITE}#conquer-2026`,
    name: 'Mais rápido não é mais longe: IA aplicada a negócios',
    description: 'Treinamento para empresários sobre como escolher onde aplicar IA antes de acelerar, com sistemas reais da Epicora na tela.',
    startDate: '2026-09-23T19:30:00-03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Conquer Chapecó', address: { '@type': 'PostalAddress', addressLocality: 'Chapecó', addressRegion: 'SC', addressCountry: 'BR' } },
    performer: { '@id': `${SITE}#pedro` },
    organizer: [{ '@id': 'https://epicora.com.br/#organization' }, { '@type': 'Organization', name: 'Conquer Chapecó' }],
    inLanguage: 'pt-BR',
  };
  const pagina = {
    '@type': 'ProfilePage',
    '@id': `${SITE}#pagina`,
    url: SITE,
    name: 'Pedro Cunha · CTO da Epicora',
    inLanguage: 'pt-BR',
    dateModified: hoje,
    mainEntity: { '@id': `${SITE}#pedro` },
    hasPart: lista.map((a) => ({
      '@type': 'BlogPosting', headline: a.titulo, url: a.link, datePublished: a.data, author: { '@id': `${SITE}#pedro` },
    })),
  };
  // "<" escapado para o JSON nunca fechar a tag <script>.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [pagina, pessoa, epicora, palestra] }).replace(/</g, '\\u003c');
}

const lista = (await artigos()).slice(0, QTD_ARTIGOS);
const hoje = hojeBrasilia();
const versao = hoje.replace(/-/g, '') + '2';

const troca = {
  SITE, EMAIL, VERSAO: versao, ANO: hoje.slice(0, 4), ATUALIZADO: dataCurta(hoje),
  LINKEDIN: PERFIS.linkedin, INSTAGRAM: PERFIS.instagram, YOUTUBE: PERFIS.youtube, GITHUB: PERFIS.github, AUTOR: PERFIS.autor,
  LOGOS: htmlLogos, FILTROS: htmlFiltros, TRABALHO: htmlTrabalho, DEPOIMENTOS: htmlDepoimentos,
  FORMATOS: htmlFormatos, TEMAS: htmlTemas, ARTIGOS: htmlArtigos(lista), TRAJETORIA: htmlTrajetoria, STACK: htmlStack,
  JSONLD: jsonld(hoje, lista),
};
const tpl = await readFile(new URL('./src/template.html', import.meta.url), 'utf8');
const html = tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in troca ? troca[k] : m));
const sobrou = html.match(/\{\{\w+\}\}/);
if (sobrou) throw new Error(`placeholder sem valor: ${sobrou[0]}`);

await writeFile(new URL('./index.html', import.meta.url), html);

await writeFile(new URL('./sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${hoje}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE}links/</loc><lastmod>${hoje}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>
</urlset>
`);

await writeFile(new URL('./llms.txt', import.meta.url), `# Pedro Cunha

> Pedro Henrique Hoffmann da Cunha é CTO e sócio da Epicora Software House, software house de Chapecó (SC). Lidera o time que constrói software sob medida e dá treinamentos e palestras de IA aplicada a negócios para empresários e times.

## Quem é
- Cargo: CTO (Diretor de Tecnologia) e sócio da Epicora Software House, desde 2024.
- Cidade: Chapecó, Santa Catarina, Brasil.
- Formação: Técnico em Desenvolvimento de Sistemas (SESI SENAI) e Análise e Desenvolvimento de Sistemas (Faculdade SENAI).
- Origem: desenvolvedor front-end desde 2019.
- Trabalho: escopo, arquitetura e entrega de sistemas sob medida (aplicativos, plataformas web, integrações e agentes de IA). O time já entregou mais de 60 sistemas para mais de 40 empresas.

## Treinamentos e palestras de IA
- "Mais rápido não é mais longe: IA aplicada a negócios", treinamento para empresários na Conquer Chapecó, 23/09/2026.
- Formatos: ${FORMATOS.map((f) => `${f.nome} (${f.duracao})`).join('; ')}.
- Temas: ${TEMAS.map((t) => t.tema).join('; ')}.
- Contato para treinamentos: ${EMAIL}

## Perfis
- [LinkedIn](${PERFIS.linkedin})
- [Instagram](${PERFIS.instagram})
- [YouTube](${PERFIS.youtube})
- [GitHub](${PERFIS.github})
- [Página de autor no blog da Epicora](${PERFIS.autor})
- [Epicora Software House](https://epicora.com.br)

## Artigos recentes
${lista.map((a) => `- [${a.titulo}](${a.link}) (${a.data})`).join('\n')}

## Sistemas construídos na Epicora (cases públicos)
${TRABALHO.map((t) => `- [${t.cliente}](${caseUrl(t.slug)}): ${t.titulo} ${t.valor} ${t.rotulo}.`).join('\n')}
`);

console.log(`ok: ${lista.length} artigos, ${TRABALHO.length} cases, ${LOGOS.length} logos, ${hoje}`);
