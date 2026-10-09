// Movimento do site: um gesto por bloco e tudo desligável.
// Com "reduzir movimento" ligado, a página aparece pronta.
(() => {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.documentElement;

  // Nome do hero letra a letra (o texto real fica no aria-label do h1).
  document.querySelectorAll('[data-letras]').forEach((linha) => {
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

  // Relógio da barra de estado, no fuso de Chapecó.
  const relogio = document.getElementById('relogio');
  if (relogio) {
    const fmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    const tique = () => { relogio.textContent = fmt.format(new Date()) + ' BRT'; };
    tique();
    setInterval(tique, 15000);
  }

  // Revelação ao entrar na tela.
  const io = new IntersectionObserver((itens) => {
    itens.forEach((it) => {
      if (it.isIntersecting) { it.target.classList.add('in'); io.unobserve(it.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el) => (reduz ? el.classList.add('in') : io.observe(el)));

  // Grade do hero acompanha o ponteiro.
  const hero = document.querySelector('.hero');
  if (hero && !reduz) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }

  // O traço: problema → produto → impacto.
  const svg = document.getElementById('traco');
  if (svg) {
    const viva = svg.querySelector('.linha-viva');
    const ests = [...svg.querySelectorAll('.est')];
    const miolos = [...svg.querySelectorAll('.est-miolo')];
    const parts = [...svg.querySelectorAll('.part')];
    const total = viva.getTotalLength();
    const paradas = ests.map((e) => Number(e.dataset.at));
    const acende = (p) => paradas.forEach((at, i) => {
      ests[i].classList.toggle('on', p >= at - 0.002);
      miolos[i].classList.toggle('on', p >= at - 0.002);
    });

    if (reduz) {
      viva.style.strokeDasharray = 'none';
      acende(1);
      parts.forEach((pt) => pt.setAttribute('opacity', 0));
    } else {
      viva.style.strokeDasharray = total;
      viva.style.strokeDashoffset = total;
      const t0 = performance.now() + 700;
      const desenho = 1700;
      let ciclo = null;
      const passo = (agora) => {
        const t = agora - t0;
        if (t < 0) { requestAnimationFrame(passo); return; }
        if (t < desenho) {
          const p = 1 - Math.pow(1 - t / desenho, 3);
          viva.style.strokeDashoffset = total * (1 - p);
          acende(p);
          requestAnimationFrame(passo);
          return;
        }
        viva.style.strokeDashoffset = 0;
        acende(1);
        // Partículas correm a linha de tempos em tempos, como no Mapa do Atlas.
        if (ciclo === null) ciclo = agora;
        const dur = 2600, pausa = 1800;
        const c = (agora - ciclo) % (dur + pausa);
        parts.forEach((pt, k) => {
          const tt = (c - k * 70) / dur;
          if (tt < 0 || tt > 1) { pt.setAttribute('opacity', 0); return; }
          const e = tt < .5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;
          const pnt = viva.getPointAtLength(e * total);
          pt.setAttribute('cx', pnt.x);
          pt.setAttribute('cy', pnt.y);
          pt.setAttribute('opacity', (1 - k / parts.length) * Math.min(1, tt * 8, (1 - tt) * 8));
        });
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
  }

  // Espinha da página e linha da trajetória seguem a rolagem.
  const espinha = document.querySelector('.espinha');
  const paradas = document.querySelector('.paradas');
  const itens = paradas ? [...paradas.querySelectorAll('.parada')] : [];
  const links = [...document.querySelectorAll('.nav a')];
  const secoes = links.map((a) => document.querySelector(a.getAttribute('href')));
  let agendado = false;
  const rolagem = () => {
    agendado = false;
    const h = doc.scrollHeight - innerHeight;
    if (espinha) espinha.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0);
    if (paradas) {
      const r = paradas.getBoundingClientRect();
      const meio = innerHeight * 0.62;
      const t = reduz ? 1 : Math.max(0, Math.min(1, (meio - r.top) / r.height));
      paradas.style.setProperty('--t', t);
      itens.forEach((it) => it.classList.toggle('on', reduz || it.getBoundingClientRect().top < meio));
    }
    let ativa = -1;
    secoes.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) ativa = i; });
    links.forEach((a, i) => a.classList.toggle('ativo', i === ativa));
  };
  addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(rolagem); } }, { passive: true });
  addEventListener('resize', rolagem);
  rolagem();
})();
