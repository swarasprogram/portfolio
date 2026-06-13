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

  /* ---------- Three.js animated background ---------- */
  function initThree() {
    if (typeof THREE === 'undefined' || reduced) return;
    const canvas = document.getElementById('bgCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 14;

    // Particle sphere
    const COUNT = 900;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    // Subtle starfield: pale white with indigo & cyan accents to match the aurora
    const c1 = new THREE.Color(0x9d8bff), c2 = new THREE.Color(0xeaf0ff), c3 = new THREE.Color(0x2fd4f0);
    for (let i = 0; i < COUNT; i++) {
      const r = 8 + Math.random() * 2.5;
      const th = Math.acos(2 * Math.random() - 1);
      const ph = Math.random() * Math.PI * 2;
      pos[i*3] = r * Math.sin(th) * Math.cos(ph);
      pos[i*3+1] = r * Math.sin(th) * Math.sin(ph);
      pos[i*3+2] = r * Math.cos(th);
      const m = Math.random();
      const c = m < 0.38 ? c1 : m < 0.85 ? c2 : c3;
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Floating wireframe knot
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.4, 0.5, 120, 16),
      new THREE.MeshBasicMaterial({ color: 0x6d8cc0, wireframe: true, transparent: true, opacity: 0.07 })
    );
    scene.add(knot);

    let tmx = 0, tmy = 0;
    addEventListener('mousemove', e => { tmx = (e.clientX / innerWidth - 0.5); tmy = (e.clientY / innerHeight - 0.5); });
    let scrollY2 = 0;
    addEventListener('scroll', () => { scrollY2 = scrollY; }, { passive: true });

    const clock = new THREE.Clock();
    (function render() {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.05 + tmx * 0.4;
      points.rotation.x = tmy * 0.3 + scrollY2 * 0.0003;
      knot.rotation.x = t * 0.12; knot.rotation.y = t * 0.15;
      knot.position.y = Math.sin(t * 0.5) * 0.6;
      camera.position.x += (tmx * 2 - camera.position.x) * 0.04;
      camera.position.y += (-tmy * 2 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    })();

    addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
  }
  initThree();
})();
