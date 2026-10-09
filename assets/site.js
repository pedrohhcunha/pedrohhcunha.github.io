// Pedro Cunha · site pessoal. JavaScript puro, sem dependência.
// Tudo que se mexe respeita "reduzir movimento": a página aparece pronta.
(() => {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = matchMedia('(pointer: fine)').matches;
  const doc = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmtNum = new Intl.NumberFormat('pt-BR');

  // ── Nome letra a letra (o texto real fica no aria-label do h1) ──────
  $$('[data-letras]').forEach((linha) => {
    const txt = linha.textContent;
    linha.textContent = '';
    [...txt].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'l';
      s.style.setProperty('--i', i + Number(linha.dataset.letras || 0));
      s.textContent = c;
      s.setAttribute('aria-hidden', 'true');
      linha.appendChild(s);
    });
  });
  requestAnimationFrame(() => requestAnimationFrame(() => doc.classList.add('pronto')));

  // ── Relógio no fuso de Chapecó ──────────────────────────────────────
  const relogio = $('#relogio');
  if (relogio) {
    const fmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    const tique = () => { relogio.textContent = fmt.format(new Date()) + ' BRT'; };
    tique();
    setInterval(tique, 15000);
  }

  // ── Revelação ao entrar na tela ─────────────────────────────────────
  const io = new IntersectionObserver((itens) => {
    itens.forEach((it) => { if (it.isIntersecting) { it.target.classList.add('in'); io.unobserve(it.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach((el) => (reduz ? el.classList.add('in') : io.observe(el)));

  // ── Grade de pontos do hero segue o ponteiro ────────────────────────
  const hero = $('.hero');
  if (hero && !reduz) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }

  // ── Retrato em pontos ───────────────────────────────────────────────
  // Cada ponto nasce de um pixel do retrato (assets/img/retrato-pontos.png)
  // e lembra onde mora. O cursor empurra, a mola traz de volta.
  const retrato = { pontos: [] };
  (() => {
    const canvas = $('#retrato');
    if (!canvas || !canvas.getContext) { doc.classList.add('no-canvas'); return; }
    const ctx = canvas.getContext('2d');
    const fonte = new Image();
    fonte.src = 'assets/img/retrato-pontos.png';
    let dados = null, iw = 0, ih = 0, w = 0, h = 0, passo = 6, dpr = 1;
    let pontos = [];
    const mouse = { x: -9999, y: -9999, ativo: false };
    const raio = () => passo * 15;
    const forca = 2.4, mola = 0.055, atrito = 0.84;
    let visivel = true, parado = false, t0 = performance.now();

    const montar = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      passo = w < 420 ? 5 : 6;
      const antigos = pontos;
      pontos = [];
      for (let y = passo / 2; y < h; y += passo) {
        for (let x = passo / 2; x < w; x += passo) {
          const sx = Math.min(iw - 1, Math.floor(x / w * iw));
          const sy = Math.min(ih - 1, Math.floor(y / h * ih));
          // Base esmaece para o retrato não terminar num corte reto.
          const fundo = Math.min(1, (h - y) / (h * 0.14));
          let v = dados[(sy * iw + sx) * 4] / 255 * fundo;
          if (v < 0.09) v = 0; // ponto apagado: a grade de fundo, que acende perto do cursor
          // Primeira vez: os pontos chegam espalhados e se assentam.
          const ini = antigos.length || reduz ? { x, y } : { x: x + (Math.random() - .5) * w * 1.4, y: y + (Math.random() - .3) * h * 1.2 };
          pontos.push({ hx: x, hy: y, x: ini.x, y: ini.y, vx: 0, vy: 0, v });
        }
      }
      retrato.pontos = pontos;
      const total = fmtNum.format(pontos.length);
      const leg = $('#retrato-pontos'); if (leg) leg.textContent = `retrato em ${total} pontos`;
      const spec = $('#spec-pontos'); if (spec) spec.textContent = `${total} pontos`;
      parado = false;
    };

    // Cores em faixas: um path por faixa desenha milhares de círculos rápido.
    const FAIXAS = 7;
    const cor = (k, perto) => {
      const v = k / (FAIXAS - 1);
      if (perto) return `rgb(${Math.round(97 + 72 * v)},${Math.round(0 + 139 * v)},255)`;
      return `rgb(${Math.round(169 + 63 * v)},${Math.round(139 + 93 * v)},${Math.round(255 - 19 * v)})`;
    };

    const quadro = (agora) => {
      if (!visivel) { requestAnimationFrame(quadro); return; }
      const t = agora - t0;
      ctx.clearRect(0, 0, w, h);
      const R = raio(), R2 = R * R;
      let movendo = 0;
      const paths = Array.from({ length: FAIXAS * 2 }, () => new Path2D());
      const apagados = new Path2D();
      for (const p of pontos) {
        let perto = false;
        if (mouse.ativo) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * forca;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
            perto = d < R * 0.75;
          }
        }
        p.vx = (p.vx + (p.hx - p.x) * mola) * atrito;
        p.vy = (p.vy + (p.hy - p.y) * mola) * atrito;
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.02) movendo++;
        const onda = reduz ? 1 : 1 + 0.14 * Math.sin(t * 0.0016 + p.hy * 0.035 - p.hx * 0.012);
        const r = p.v ? (0.28 + p.v * 0.62) * passo * 0.5 * onda : (perto ? 1.1 : 0.6);
        const k = p.v ? Math.min(FAIXAS - 1, Math.floor(p.v * FAIXAS)) : 0;
        const path = p.v || perto ? paths[k + (perto ? FAIXAS : 0)] : apagados;
        path.moveTo(p.x + r, p.y);
        path.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = '#26262e'; ctx.fill(apagados);
      paths.forEach((path, i) => { ctx.fillStyle = cor(i % FAIXAS, i >= FAIXAS); ctx.fill(path); });
      parado = reduz && movendo === 0;
      if (!parado) requestAnimationFrame(quadro);
    };

    const acordar = () => { if (parado) { parado = false; requestAnimationFrame(quadro); } };
    const pos = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.ativo = true; acordar(); };
    canvas.addEventListener('pointermove', pos);
    canvas.addEventListener('pointerdown', (e) => {
      pos(e);
      // Clique: os pontos explodem a partir do cursor e voltam para casa.
      for (const p of pontos) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - d / (w * 0.9)) * 22;
        p.vx += (dx / d) * f; p.vy += (dy / d) * f;
      }
    });
    canvas.addEventListener('pointerleave', () => { mouse.ativo = false; });
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) acordar(); }).observe(canvas);

    fonte.onload = () => {
      const off = document.createElement('canvas');
      iw = off.width = fonte.naturalWidth; ih = off.height = fonte.naturalHeight;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(fonte, 0, 0);
      try { dados = octx.getImageData(0, 0, iw, ih).data; } catch { doc.classList.add('no-canvas'); return; }
      montar();
      requestAnimationFrame(quadro);
      let espera;
      addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(() => { montar(); acordar(); }, 150); });
    };
    fonte.onerror = () => doc.classList.add('no-canvas');
  })();

  // ── Trabalho: filtros e prévia que segue o cursor ───────────────────
  const itens = $$('.item');
  $$('.filtro').forEach((b) => b.addEventListener('click', () => {
    $$('.filtro').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const g = b.dataset.filtro;
    itens.forEach((it) => it.classList.toggle('oculto', g !== 'todos' && it.dataset.grupo !== g));
  }));

  const preview = $('.preview');
  if (preview && ponteiroFino && !reduz) {
    const dentro = $('.preview-in');
    let alvoX = 0, alvoY = 0, x = 0, y = 0, rodando = false, ultimoX = 0;
    const seguir = () => {
      x += (alvoX - x) * 0.18; y += (alvoY - y) * 0.18;
      preview.style.setProperty('--px', `${x}px`);
      preview.style.setProperty('--py', `${y}px`);
      const vel = Math.max(-8, Math.min(8, (alvoX - ultimoX) * 0.25));
      dentro.style.setProperty('--rot', `${vel}deg`);
      ultimoX += (alvoX - ultimoX) * 0.2;
      if (rodando) requestAnimationFrame(seguir);
    };
    itens.forEach((it) => {
      const a = it.querySelector('a');
      a.addEventListener('mouseenter', (e) => {
        dentro.style.backgroundImage = `url(${it.dataset.img})`;
        alvoX = x = e.clientX + 24; alvoY = y = e.clientY - 110; ultimoX = alvoX;
        preview.classList.add('on');
        if (!rodando) { rodando = true; requestAnimationFrame(seguir); }
      });
      a.addEventListener('mousemove', (e) => { alvoX = e.clientX + 24; alvoY = e.clientY - 110; });
      a.addEventListener('mouseleave', () => { preview.classList.remove('on'); rodando = false; });
    });
    // Pré-carrega as capas para a troca ser instantânea.
    itens.forEach((it) => { const i = new Image(); i.src = it.dataset.img; });
  }

  // ── Depoimentos ─────────────────────────────────────────────────────
  const depos = $$('.depo-item');
  if (depos.length) {
    let atual = 0, timer;
    const barra = $('.depo-barra i'), n = $('#depo-n');
    const mostrar = (i) => {
      atual = (i + depos.length) % depos.length;
      depos.forEach((d, k) => d.classList.toggle('on', k === atual));
      n.textContent = `${String(atual + 1).padStart(2, '0')} / ${String(depos.length).padStart(2, '0')}`;
      barra.classList.remove('anda'); void barra.offsetWidth; barra.classList.add('anda');
      clearTimeout(timer);
      if (!reduz) timer = setTimeout(() => mostrar(atual + 1), 7000);
    };
    $$('[data-depo]').forEach((b) => b.addEventListener('click', () => mostrar(atual + Number(b.dataset.depo))));
    const caixa = $('.depo');
    caixa.addEventListener('mouseenter', () => { clearTimeout(timer); barra.style.animationPlayState = 'paused'; });
    caixa.addEventListener('mouseleave', () => { barra.style.animationPlayState = ''; mostrar(atual); });
    mostrar(0);
  }

  // ── Slides: arrastar com o mouse ────────────────────────────────────
  const trilho = $('.slides-trilho');
  if (trilho && ponteiroFino) {
    let ini = null;
    trilho.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; ini = { x: e.clientX, s: trilho.scrollLeft }; trilho.classList.add('arrastando'); });
    addEventListener('pointermove', (e) => { if (ini) trilho.scrollLeft = ini.s - (e.clientX - ini.x); });
    addEventListener('pointerup', () => { if (ini) { ini = null; trilho.classList.remove('arrastando'); } });
  }

  // ── Editor: digita o código do retrato ──────────────────────────────
  const codigo = $('#codigo');
  if (codigo) {
    const fonteCod = [
      '// cada ponto lembra onde mora no retrato',
      'for (const p of pontos) {',
      '  const dx = p.x - mouse.x, dy = p.y - mouse.y;',
      '  const d = Math.hypot(dx, dy);',
      '  if (d < raio) {          // o cursor empurra',
      '    const f = (1 - d / raio) * 2.4;',
      '    p.vx += (dx / d) * f;',
      '    p.vy += (dy / d) * f;',
      '  }',
      '  // e a mola traz de volta para casa',
      '  p.vx = (p.vx + (p.hx - p.x) * 0.055) * 0.84;',
      '  p.vy = (p.vy + (p.hy - p.y) * 0.055) * 0.84;',
      '  p.x += p.vx;  p.y += p.vy;',
      '}',
    ].join('\n');
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const pinta = (s) => esc(s).split('\n').map((l) => {
      const ci = l.indexOf('//');
      const cod = ci >= 0 ? l.slice(0, ci) : l;
      const com = ci >= 0 ? `<span class="c">${l.slice(ci)}</span>` : '';
      return cod
        .replace(/\b(const|for|of|if|let)\b/g, '<span class="k">$1</span>')
        .replace(/\b(Math\.hypot)\b/g, '<span class="f">$1</span>')
        .replace(/(?<![\w.])(\d+(?:\.\d+)?)\b/g, '<span class="n">$1</span>') + com;
    }).join('\n');
    if (reduz) { codigo.innerHTML = pinta(fonteCod); }
    else {
      let i = 0, iniciado = false;
      const digita = () => {
        i += fonteCod[i] === ' ' ? 2 : 1;
        codigo.innerHTML = pinta(fonteCod.slice(0, i)) + '<span class="cursor"></span>';
        if (i < fonteCod.length) setTimeout(digita, fonteCod[i - 1] === '\n' ? 140 : 18 + Math.random() * 30);
      };
      new IntersectionObserver(([e], obs) => { if (e.isIntersecting && !iniciado) { iniciado = true; obs.disconnect(); digita(); } }, { threshold: 0.4 }).observe(codigo);
    }
  }

  // ── Portas do contato: brilho segue o ponteiro ──────────────────────
  $$('.porta').forEach((p) => p.addEventListener('pointermove', (e) => {
    const r = p.getBoundingClientRect();
    p.style.setProperty('--gx', `${e.clientX - r.left}px`);
    p.style.setProperty('--gy', `${e.clientY - r.top}px`);
  }));

  // ── Rolagem: espinha, trajetória e item ativo do menu ───────────────
  const espinha = $('.espinha');
  const paradas = $('.paradas');
  const pItens = paradas ? $$('.parada', paradas) : [];
  const links = $$('.nav a');
  const secoes = links.map((a) => $(a.getAttribute('href')));
  let agendado = false;
  const rolagem = () => {
    agendado = false;
    const H = doc.scrollHeight - innerHeight;
    if (espinha) espinha.style.setProperty('--p', H > 0 ? Math.min(1, scrollY / H) : 0);
    if (paradas) {
      const r = paradas.getBoundingClientRect();
      const meio = innerHeight * 0.62;
      paradas.style.setProperty('--t', reduz ? 1 : Math.max(0, Math.min(1, (meio - r.top) / r.height)));
      pItens.forEach((it) => it.classList.toggle('on', reduz || it.getBoundingClientRect().top < meio));
    }
    let ativa = -1;
    secoes.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) ativa = i; });
    links.forEach((a, i) => a.classList.toggle('ativo', i === ativa));
  };
  addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(rolagem); } }, { passive: true });
  addEventListener('resize', rolagem);
  rolagem();

  // ── Raio-x: o site mostra como foi montado ──────────────────────────
  const painel = $('.raio-painel');
  const camada = $('.raio-camada');
  let raioOn = false, fpsTimer = null, rotulosTimer = null;
  const rotular = () => {
    camada.innerHTML = '';
    $$('[data-x]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const top = r.top + scrollY, left = r.left + scrollX;
      const b = document.createElement('b');
      Object.assign(b.style, { top: `${top}px`, left: `${left}px`, width: `${r.width}px`, height: `${r.height}px` });
      const s = document.createElement('span');
      s.textContent = `${el.dataset.x} · ${Math.round(r.width)}×${Math.round(r.height)}`;
      Object.assign(s.style, { top: `${top}px`, left: `${left}px` });
      camada.append(b, s);
    });
  };
  const medir = () => {
    let quadros = 0, ini = performance.now();
    const conta = (t) => {
      if (!raioOn) return;
      quadros++;
      if (t - ini >= 1000) { $('#rx-fps').textContent = Math.round(quadros * 1000 / (t - ini)); quadros = 0; ini = t; }
      requestAnimationFrame(conta);
    };
    requestAnimationFrame(conta);
    const atualiza = () => {
      $('#rx-dom').textContent = fmtNum.format(document.getElementsByTagName('*').length);
      const ent = [...performance.getEntriesByType('navigation'), ...performance.getEntriesByType('resource')];
      const bytes = ent.reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0);
      $('#rx-peso').textContent = `${fmtNum.format(Math.round(bytes / 1024))} KB`;
      $('#rx-pontos').textContent = fmtNum.format(retrato.pontos.length);
    };
    atualiza();
    fpsTimer = setInterval(atualiza, 1000);
  };
  const raio = (ligar) => {
    raioOn = ligar;
    doc.classList.toggle('raio-x', ligar);
    painel.hidden = !ligar;
    $$('.raio-btn').forEach((b) => b.setAttribute('aria-pressed', String(ligar)));
    clearInterval(fpsTimer); clearInterval(rotulosTimer);
    if (ligar) { rotular(); medir(); rotulosTimer = setInterval(rotular, 1200); }
    else camada.innerHTML = '';
  };
  $$('[data-raio]').forEach((b) => b.addEventListener('click', () => raio(!raioOn)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && raioOn) raio(false); });
})();
