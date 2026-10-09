// Gera index.html, sitemap.xml e llms.txt a partir de src/.
// Os artigos vêm do RSS do blog da Epicora; se o RSS falhar, usa o último
// cache (src/artigos.json) para o site nunca sair sem a seção.
//
//   node build.mjs
//
// Roda sozinho toda segunda no GitHub Actions (.github/workflows/atualizar.yml).

import { readFile, writeFile } from 'node:fs/promises';
import { SITE, PERFIS, SISTEMAS, TRAJETORIA } from './src/dados.mjs';

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
const sai = '<svg class="ir"><use href="#sai"/></svg>';

const htmlSistemas = SISTEMAS.map((s, i) => `          <a class="linha-sis" role="listitem" href="https://epicora.com.br/cases/${s.slug}">
            <span class="cod mono">C-${String(i + 1).padStart(2, '0')}</span>
            <span class="cli">${esc(s.cliente)}<small>${esc(s.setor)}</small></span>
            <span class="tit">${esc(s.titulo)}</span>
            <span class="est"><span class="chip chip-no-ar"><span class="pulso"></span>em produção</span>${sai}</span>
          </a>`).join('\n');

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

function jsonld(hoje, lista) {
  const pessoa = {
    '@type': 'Person',
    '@id': `${SITE}#pedro`,
    name: 'Pedro Cunha',
    alternateName: 'Pedro Henrique Hoffmann da Cunha',
    givenName: 'Pedro',
    familyName: 'Cunha',
    url: SITE,
    image: `${SITE}assets/img/pedro-720.webp`,
    jobTitle: 'CTO (Diretor de Tecnologia)',
    description: 'CTO e sócio da Epicora Software House. Constrói software sob medida e coloca IA para trabalhar dentro de empresas.',
    worksFor: { '@id': 'https://epicora.com.br/#organization' },
    address: { '@type': 'PostalAddress', addressLocality: 'Chapecó', addressRegion: 'SC', addressCountry: 'BR' },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Faculdade SENAI Santa Catarina' },
      { '@type': 'EducationalOrganization', name: 'SESI SENAI Chapecó' },
    ],
    knowsAbout: [
      'Software sob medida', 'Inteligência artificial aplicada a negócios', 'Agentes de IA',
      'Arquitetura de software', 'Desenvolvimento de aplicativos', 'Gestão de times de tecnologia',
    ],
    sameAs: [PERFIS.linkedin, PERFIS.instagram, PERFIS.youtube, PERFIS.github, PERFIS.autor],
  };
  const epicora = {
    '@type': 'Organization',
    '@id': 'https://epicora.com.br/#organization',
    name: 'Epicora Software House',
    url: 'https://epicora.com.br',
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
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [pagina, pessoa, epicora] }).replace(/</g, '\\u003c');
}

const lista = (await artigos()).slice(0, QTD_ARTIGOS);
const hoje = hojeBrasilia();
const versao = hoje.replace(/-/g, '');

const troca = {
  SITE, VERSAO: versao, ANO: hoje.slice(0, 4), ATUALIZADO: dataCurta(hoje),
  LINKEDIN: PERFIS.linkedin, INSTAGRAM: PERFIS.instagram, YOUTUBE: PERFIS.youtube, GITHUB: PERFIS.github,
  SISTEMAS: htmlSistemas, ARTIGOS: htmlArtigos(lista), TRAJETORIA: htmlTrajetoria, JSONLD: jsonld(hoje, lista),
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

> Pedro Henrique Hoffmann da Cunha é CTO e sócio da Epicora Software House, software house de Chapecó (SC) que constrói software sob medida e coloca IA para trabalhar dentro de empresas.

## Quem é
- Cargo: CTO (Diretor de Tecnologia) e sócio da Epicora Software House, desde 2024.
- Cidade: Chapecó, Santa Catarina, Brasil.
- Formação: Técnico em Desenvolvimento de Sistemas (SESI SENAI) e Análise e Desenvolvimento de Sistemas (Faculdade SENAI).
- Trabalho: escopo, arquitetura e entrega de sistemas sob medida (aplicativos, plataformas web, integrações e agentes de IA) para empresas de indústria, saúde, agro e serviços.

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
${SISTEMAS.map((s) => `- [${s.cliente}](https://epicora.com.br/cases/${s.slug}): ${s.titulo}`).join('\n')}
`);

console.log(`ok: ${lista.length} artigos, ${SISTEMAS.length} sistemas, ${hoje}`);
