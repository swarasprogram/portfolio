/* ===========================================================
   Swarada Joshi — Portfolio interactions
   =========================================================== */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPct');
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(tick); setTimeout(() => loader.classList.add('done'), 350); }
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 130);

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Static starfield (drawn once, no animation) ---------- */
  const sf = document.getElementById('starfield');
  if (sf) {
    let html = '';
    for (let i = 0; i < 160; i++) {
      const x = (Math.random() * 100).toFixed(2);
      const y = (Math.random() * 100).toFixed(2);
      const s = (Math.random() * 1.5 + 0.6).toFixed(2);
      const o = (Math.random() * 0.5 + 0.18).toFixed(2);
      const c = Math.random() < 0.22 ? '139,166,201' : '255,255,255';
      html += `<i style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;opacity:${o};background:rgb(${c})"></i>`;
    }
    sf.innerHTML = html;
  }

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const ringText = document.createElement('span');
  ringText.className = 'ct'; ring.appendChild(ringText);
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  if (!('ontouchstart' in window)) {
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const t = el.getAttribute('data-cursor-text');
        if (t) { ring.classList.add('text'); ringText.textContent = t; }
        else ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => { ring.classList.remove('hover', 'text'); ringText.textContent = ''; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduced) document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.3}px,${y * 0.4}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ---------- Project card spotlight ---------- */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Tilt ---------- */
  if (!reduced) document.querySelectorAll('.tilt, [data-tilt-card]').forEach(el => {
    const amt = el.hasAttribute('data-tilt-card') ? 5 : 7;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * amt}deg) rotateX(${-py * amt}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ---------- Nav scroll state + progress ---------- */
  const nav = document.getElementById('nav');
  const prog = document.getElementById('scrollProgress');
  addEventListener('scroll', () => {
    const sc = scrollY;
    nav.classList.toggle('shrink', sc > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (sc / h * 100) + '%';
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open'); menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); menu.classList.remove('open');
  }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal-up, .section .reveal').forEach(el => io.observe(el));

  /* ---------- Active-section highlight (scroll-spy) ---------- */
  const navLinkEls = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const spySections = navLinkEls
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (spySections.length) {
    const updateActive = () => {
      const probe = scrollY + innerHeight * 0.35;
      let current = null;
      spySections.forEach(s => {
        if (s.getBoundingClientRect().top + scrollY <= probe) current = s;
      });
      const id = current ? '#' + current.id : null;
      navLinkEls.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    };
    addEventListener('scroll', updateActive, { passive: true });
    addEventListener('resize', updateActive);
    updateActive();
  }

  /* ---------- Smooth in-page scrolling (robust against overflow quirks) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = id === '#home' ? 0 : 70;
      const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
      burger.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || '0');
      const suffix = el.dataset.suffix || '';
      const dur = 1500; const t0 = performance.now();
      const step = now => {
        const k = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = (target * e).toFixed(dec) + suffix;
        if (k < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Role rotator (typing) ---------- */
  const roles = ['Full-Stack Developer', 'AI / ML Builder', 'Published Researcher', 'DevOps Enthusiast', 'Problem Solver'];
  const rr = document.getElementById('roleRotator');
  let ri = 0, ci = 0, deleting = false;
  function typeRole() {
    const word = roles[ri];
    rr.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) { ci++; setTimeout(typeRole, 70); }
    else if (!deleting && ci === word.length) { deleting = true; setTimeout(typeRole, 1600); }
    else if (deleting && ci > 0) { ci--; setTimeout(typeRole, 35); }
    else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeRole, 250); }
  }
  if (!reduced) setTimeout(typeRole, 1200); else rr.textContent = roles[0];

})();
