# pedrohhcunha.github.io

Site pessoal do Pedro Cunha, CTO e sócio da Epicora Software House.
No ar em https://pedrohhcunha.github.io/

Visual: marca Epicora com a gramática do Watchtower (a mesma do Epicora Atlas):
fundo ink, fio de 1 px, roxo `#6100ff` só para ação, verde-água só para "no ar",
Space Grotesk nos títulos, Alexandria no corpo e Space Mono nos códigos.

Seções: hero com o **retrato em pontos** (canvas, ~9 mil pontos com física de mola
que reage ao mouse e ao clique), faixa de logos, índice de trabalho com o número
de cada case e prévia que segue o cursor, depoimentos, **treinamentos e palestras**
(vídeo da Conquer, slides, formatos e temas), artigos, front-end (trajetória e o
editor que digita o código do retrato) e contato. O botão **raio-x** mostra o site
por dentro: grid, componentes com tamanho real e um painel com quadros/s, nós no
DOM e peso transferido.

## Como funciona

- `src/template.html` é a página; `src/dados.mjs` tem os cases, a trajetória e os perfis.
- `node build.mjs` lê o RSS do blog da Epicora (`epicora.com.br/rss.xml`), pega os
  5 artigos mais recentes e gera `index.html`, `sitemap.xml` e `llms.txt`.
  Se o RSS falhar, usa o último cache em `src/artigos.json`.
- `.github/workflows/publicar.yml` publica no Pages a cada push na `master` e
  toda segunda às 06h, então os artigos novos entram sozinhos.
- `links/` é a página de links para a bio do Instagram.
- `tools/render.cjs` regera a imagem de compartilhamento (`assets/og.jpg`) e o
  ícone a partir de `tools/og.html` (precisa do Playwright).
- `assets/img/retrato-pontos.png` é a fonte do retrato em pontos: cada pixel claro vira um ponto.
- `assets/media/palco.*` é o loop de 8 s da palestra na Conquer (C0477, 4:51).

## Mudar alguma coisa

| Quero mudar | Onde |
|---|---|
| Texto de uma seção | `src/template.html` |
| Case novo da Epicora | `TRABALHO` em `src/dados.mjs` (+ capa em `assets/cases/`) |
| Logos, depoimentos, formatos e temas de treinamento | `src/dados.mjs` |
| Trajetória | `TRAJETORIA` em `src/dados.mjs` |
| Cores, tipografia, layout | `assets/style.css` |
| Animações | `assets/site.js` |

Depois de editar: `node build.mjs`, conferir com `python -m http.server` e dar push.
