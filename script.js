/* ======================================================
   NAVEEN S — PORTFOLIO SCRIPT (Top Navbar version)
   ====================================================== */
(function () {
  'use strict';

  /* ── EmailJS config — replace these 3 values ── */
  var EJ_PK  = 'YOUR_PUBLIC_KEY';
  var EJ_SID = 'YOUR_SERVICE_ID';
  var EJ_TID = 'YOUR_TEMPLATE_ID';

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: EJ_PK });
    initCursor();
    initProgressBar();
    initNavbar();
    initNavActiveLinks();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initSkillBars();
    initCountUp();
    initBackToTop();
    initParticles();
    initContactForm();
    initHoverCursor();
    initSectionObserver();
    initTypingEffect();
  });

  /* ── CUSTOM CURSOR ── */
  function initCursor() {
    var cur  = document.getElementById('cursor');
    var ring = document.getElementById('cursor-ring');
    if (!cur || !ring) return;
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });
    (function lag() {
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(lag);
    })();
    document.addEventListener('mouseleave', function () {
      cur.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cur.style.opacity = '1'; ring.style.opacity = '1';
    });
  }

  function initHoverCursor() {
    var cur  = document.getElementById('cursor');
    var ring = document.getElementById('cursor-ring');
    if (!cur || !ring) return;
    var sel = 'a,button,.pj,.cert-card,.cert-row,.cinfo,.stat-card,.tech-tile,.exp-card,.edu-item,.hstat,.avail-chip,.tech-chip,.osk,.oskill,.exp-tile,.tool-ico,.testimonial-card';
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur.classList.add('big'); ring.classList.add('big'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('big'); ring.classList.remove('big'); });
    });
  }

  /* ── READ PROGRESS BAR ── */
  function initProgressBar() {
    var bar = document.getElementById('prog');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ── NAVBAR SOLID ON SCROLL ── */
  function initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('solid', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── NAVBAR ACTIVE LINKS ── */
  function initNavActiveLinks() {
    var links = document.querySelectorAll('.nav-link');
    var sections = ['home', 'about-anchor', 'experience', 'projects', 'skills', 'contact'];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          var href = a.getAttribute('href').replace('#', '');
          var match = href === e.target.id ||
            (href === 'about-anchor' && e.target.id === 'about-anchor') ||
            (href === 'experience' && (e.target.id === 'experience' || e.target.id === 'about-section')) ||
            (href === 'projects' && e.target.id === 'projects');
          a.classList.toggle('active', match);
        });
      });
    }, { threshold: 0.2, rootMargin: '-60px 0px 0px 0px' });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ── SECTION OBSERVER ── */
  function initSectionObserver() {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var kids = e.target.querySelectorAll('.reveal:not(.in)');
          kids.forEach(function (el, i) {
            setTimeout(function () { el.classList.add('in'); }, i * 60);
          });
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.04 });
    document.querySelectorAll('section, .hero-bottom').forEach(function (s) { ro.observe(s); });
  }

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });
  }

  /* ── SKILL BARS ── */
  function initSkillBars() {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('animate'); so.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.skill-row').forEach(function (el) { so.observe(el); });
  }

  /* ── COUNT-UP ── */
  function initCountUp() {
    var els = document.querySelectorAll('.stat-n, .hstat-n, .ab-n');
    if (!els.length) return;
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      el.setAttribute('data-val', match[1]);
      el.setAttribute('data-sfx', match[2]);
      co.observe(el);
    });
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-val'));
      var suffix = el.getAttribute('data-sfx') || '';
      var dur = 1500; var start = performance.now();
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        var cur = target * ease;
        el.textContent = (Number.isInteger(target) ? Math.round(cur) : cur.toFixed(2)) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      })(performance.now());
    }
  }

  /* ── TYPING EFFECT ── */
  function initTypingEffect() {
    var pill = document.querySelector('.hero-pill');
    if (!pill) return;
    var texts = ['Hi, I\'m Naveen', 'Full Stack Dev', 'MCA 2026'];
    var idx = 0; var charIdx = 0; var deleting = false;
    function type() {
      var cur = texts[idx];
      if (deleting) {
        charIdx--;
      } else {
        charIdx++;
      }
      /* update just the text node, keep dot + arrow */
      var nodes = pill.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 3) { nodes[i].textContent = ' ' + cur.slice(0, charIdx) + ' '; break; }
      }
      var delay = deleting ? 50 : 100;
      if (!deleting && charIdx === cur.length) { delay = 1800; deleting = true; }
      if (deleting && charIdx === 0) { deleting = false; idx = (idx + 1) % texts.length; delay = 300; }
      setTimeout(type, delay);
    }
    setTimeout(type, 1200);
  }

  /* ── SMOOTH SCROLL ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── MOBILE MENU ── */
  function initMobileMenu() {
    var burger  = document.getElementById('burger');
    var overlay = document.getElementById('mob-overlay');
    if (!burger) return;

    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      if (overlay) {
        if (open) { overlay.style.display = 'flex'; setTimeout(function () { overlay.classList.add('open'); }, 10); }
        else { overlay.classList.remove('open'); setTimeout(function () { overlay.style.display = ''; }, 420); }
      }
      document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.mob-link').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        if (overlay) { overlay.classList.remove('open'); setTimeout(function () { overlay.style.display = ''; }, 420); }
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        burger.classList.remove('open');
        if (overlay) { overlay.classList.remove('open'); setTimeout(function () { overlay.style.display = ''; }, 420); }
        document.body.style.overflow = '';
      }
    });
  }

  /* ── BACK TO TOP ── */
  function initBackToTop() {
    var btt = document.getElementById('btt');
    if (!btt) return;
    window.addEventListener('scroll', function () {
      btt.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── PARTICLE NETWORK ── */
  function initParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, pts = [];
    var MOUSE = { x: -9999, y: -9999 };
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', function (e) { MOUSE.x = e.clientX; MOUSE.y = e.clientY; }, { passive: true });
    for (var i = 0; i < 65; i++) {
      pts.push({ x: Math.random()*(window.innerWidth||1440), y: Math.random()*(window.innerHeight||900), r: Math.random()*1.1+0.25, dx: (Math.random()-.5)*.2, dy: (Math.random()-.5)*.2, a: Math.random()*.42+.07 });
    }
    var GOLD_RGB = '196,154,42'; var CONN_DIST = 115; var MOUSE_DIST = 140;
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        var mdx = p.x - MOUSE.x, mdy = p.y - MOUSE.y;
        var md = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < MOUSE_DIST) {
          var force = (MOUSE_DIST-md)/MOUSE_DIST*0.018;
          p.x += (mdx/md)*force*8; p.y += (mdy/md)*force*8;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba('+GOLD_RGB+','+p.a+')'; ctx.fill();
      }
      for (var i = 0; i < pts.length; i++) {
        for (var j = i+1; j < pts.length; j++) {
          var dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < CONN_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba('+GOLD_RGB+','+(0.055*(1-dist/CONN_DIST))+')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ── CONTACT FORM ── */
  function initContactForm() {
    var btn = document.getElementById('cfbtn');
    var ok  = document.getElementById('cfok');
    var err = document.getElementById('cferr');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var fn = val('fn'), fe = val('fe'), fpt = val('fpt'), fm = val('fm');
      if (!fn || !fe || !fm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fe)) { shake(btn); return; }
      var orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>&nbsp; Sending…';
      btn.disabled = true; hide(ok); hide(err);
      if (typeof emailjs !== 'undefined' && EJ_PK !== 'YOUR_PUBLIC_KEY') {
        emailjs.send(EJ_SID, EJ_TID, { from_name: fn, from_email: fe, subject: fpt||'Portfolio Contact', message: fm }).then(function () {
          ['fn','fe','fpt','fm'].forEach(function (id) { clear(id); });
          reset(btn, orig); show(ok); setTimeout(function () { hide(ok); }, 5500);
        }, function () { reset(btn, orig); show(err); setTimeout(function () { hide(err); }, 7000); });
      } else {
        setTimeout(function () {
          reset(btn, orig);
          err.textContent = '✕ EmailJS not configured yet. Email me directly: naveensivaradjane@gmail.com';
          show(err); setTimeout(function () { hide(err); }, 7000);
        }, 800);
      }
    });
    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
    function clear(id) { var el = document.getElementById(id); if (el) el.value = ''; }
    function show(el) { if (el) el.classList.add('show'); }
    function hide(el) { if (el) el.classList.remove('show'); }
    function reset(btn, orig) { btn.innerHTML = orig; btn.disabled = false; }
    function shake(el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = 'shake .4s ease'; }
  }

  /* ── HERO TILT ── */
  (function initHeroTilt() {
    var frame = document.querySelector('.hero-photo-frame');
    var halo  = document.querySelector('.hero-halo');
    if (!frame) return;
    document.addEventListener('mousemove', function (e) {
      var cx = window.innerWidth/2, cy = window.innerHeight/2;
      var rx = (e.clientY-cy)/cy*-3, ry = (e.clientX-cx)/cx*3;
      frame.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
      if (halo) halo.style.transform = 'translateX(-50%) translate('+ry*2+'px,'+rx*2+'px)';
    });
    document.addEventListener('mouseleave', function () {
      frame.style.transform = '';
      if (halo) halo.style.transform = 'translateX(-50%)';
    });
  })();

  /* ── PROJECT CARDS TILT ── */
  document.querySelectorAll('.pj').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = 'translateY(-8px) perspective(600px) rotateY('+x*6+'deg) rotateX('+(-y*4)+'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

})();