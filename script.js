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
    initPageLoader();
    initCvFallback();
    initCursor();
    initCursorTrail();
    initScrollWatcher();          /* shared RAF — replaces initProgressBar + initNavbar */
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
    initMagneticButtons();
    initThemeToggle();
    initProjectFilters();
    initMobileContactBar();
  });

  /* ── PAGE LOADER ── */
  function initPageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    // Hide after animation (1.2s fill + .3s delay)
    setTimeout(function () {
      loader.classList.add('hidden');
    }, 1600);
  }

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

  /* ── SHARED RAF SCROLL WATCHER ──
     Single rAF loop replaces two separate scroll listeners.
     Cuts duplicate layout reads and improves scroll perf.   ── */
  function initScrollWatcher() {
    var bar   = document.getElementById('prog');
    var nav   = document.getElementById('navbar');
    var btt   = document.getElementById('btt');
    var mcbar = document.getElementById('mob-contact-bar');
    var ticking = false;
    var lastY = 0;

    function update() {
      ticking = false;
      var y     = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      /* progress bar */
      if (bar)   bar.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
      /* navbar solid */
      if (nav)   nav.classList.toggle('solid', y > 40);
      /* back to top */
      if (btt)   btt.classList.toggle('show', y > 500);
      /* mobile contact bar — show after hero */
      if (mcbar) mcbar.classList.toggle('visible', y > window.innerHeight * 0.6);
      lastY = y;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update(); /* run once on load */
  }

  /* ── DARK / LIGHT THEME TOGGLE ── */
  function initThemeToggle() {
    var btn  = document.getElementById('theme-toggle');
    var icon = btn ? btn.querySelector('.theme-icon') : null;
    if (!btn) return;
    /* Restore saved preference */
    var saved = localStorage.getItem('naveen-theme');
    if (saved === 'light') { document.body.classList.add('light-mode'); if (icon) icon.textContent = '🌙'; }

    btn.addEventListener('click', function () {
      var isLight = document.body.classList.toggle('light-mode');
      if (icon) icon.textContent = isLight ? '🌙' : '☀️';
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      localStorage.setItem('naveen-theme', isLight ? 'light' : 'dark');
    });
  }

  /* ── PROJECT FILTER TABS ── */
  function initProjectFilters() {
    var filters = document.querySelectorAll('.pj-filter');
    var cards   = document.querySelectorAll('.pj[data-tags]');
    if (!filters.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* update active state */
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var f = btn.getAttribute('data-filter');
        var visIdx = 0;
        cards.forEach(function (card) {
          var tags = card.getAttribute('data-tags') || '';
          var show = f === 'all' || tags.split(',').indexOf(f) !== -1;
          if (show) {
            card.classList.remove('filtered-out');
            card.style.transitionDelay = (visIdx * 0.06) + 's';
            visIdx++;
          } else {
            card.classList.add('filtered-out');
            card.style.transitionDelay = '0s';
          }
        });
      });
    });
  }

  /* ── CURSOR TRAIL SPARKS ── */
  function initCursorTrail() {
    if (window.innerWidth < 768) return; /* desktop only */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var POOL_SIZE = 12;
    var pool = [];
    var poolIdx = 0;

    /* Create reusable spark elements */
    for (var i = 0; i < POOL_SIZE; i++) {
      var s = document.createElement('div');
      s.className = 'cursor-spark';
      document.body.appendChild(s);
      pool.push({ el: s, x: 0, y: 0, life: 0 });
    }

    document.addEventListener('mousemove', function (e) {
      var spark = pool[poolIdx % POOL_SIZE];
      poolIdx++;
      spark.x = e.clientX;
      spark.y = e.clientY;
      spark.el.style.left = spark.x + 'px';
      spark.el.style.top  = spark.y + 'px';
      spark.el.style.opacity = '0.7';
      spark.el.style.transform = 'translate(-50%,-50%) scale(1)';
      clearTimeout(spark._t);
      spark._t = setTimeout(function () {
        spark.el.style.opacity = '0';
        spark.el.style.transform = 'translate(-50%,-50%) scale(0)';
      }, 80);
    }, { passive: true });
  }

  /* ── MOBILE CONTACT BAR ── */
  function initMobileContactBar() {
    /* visibility handled inside initScrollWatcher */
    /* nothing extra needed — bar shown via CSS on mobile */
  }

  /* ── MOBILE MENU — aria-expanded + aria-label ── */

  /* ── NAVBAR ACTIVE LINKS + aria-current ── */
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
          /* keep aria-current in sync */
          if (match) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
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

    function openMenu() {
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(function () { overlay.classList.add('open'); }, 10);
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      if (overlay) {
        overlay.classList.remove('open');
        setTimeout(function () { overlay.style.display = ''; }, 420);
      }
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.querySelectorAll('.mob-link').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.classList.contains('open')) closeMenu();
    });
  }

  /* ── BACK TO TOP ── */
  function initBackToTop() {
    /* visibility of #btt handled by initScrollWatcher */
    var btt   = document.getElementById('btt');
    var ftBtt = document.querySelector('.ft-btt');
    function goTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    if (btt)   btt.addEventListener('click', goTop);
    if (ftBtt) ftBtt.addEventListener('click', function (e) { e.preventDefault(); goTop(); });
  }

  /* ── CV DOWNLOAD FALLBACK ── */
  function initCvFallback() {
    ['cv-btn', 'ft-cv-btn'].forEach(function (btnId) {
      var btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', 'NAVEEN_S_RESUME.pdf', true);
        xhr.onload = function () {
          if (xhr.status === 404 || xhr.status === 0) {
            e.preventDefault();
            var contact = document.getElementById('contact');
            if (contact) contact.scrollIntoView({ behavior: 'smooth' });
            showToast('Resume coming soon! Drop me a message below.');
          }
        };
        xhr.onerror = function () {};
        xhr.send();
      });
    });
  }

  /* ── TOAST NOTIFICATION ── */
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  /* ── PARTICLE NETWORK — mobile-aware count ── */
  function initParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    /* Skip entirely for users who prefer reduced motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, pts = [];
    var MOUSE = { x: -9999, y: -9999 };
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', function (e) { MOUSE.x = e.clientX; MOUSE.y = e.clientY; }, { passive: true });

    /* ── FIX 5: reduce particle count on mobile for performance ── */
    var COUNT = window.innerWidth < 768 ? 20 : 65;
    var CONN_DIST = window.innerWidth < 768 ? 80 : 115;
    var MOUSE_DIST = 140;

    for (var i = 0; i < COUNT; i++) {
      pts.push({
        x: Math.random() * (window.innerWidth || 1440),
        y: Math.random() * (window.innerHeight || 900),
        r: Math.random() * 1.1 + 0.25,
        dx: (Math.random() - .5) * .2,
        dy: (Math.random() - .5) * .2,
        a: Math.random() * .42 + .07
      });
    }
    var GOLD_RGB = '196,154,42';
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        var mdx = p.x - MOUSE.x, mdy = p.y - MOUSE.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST && md > 0) {
          var force = (MOUSE_DIST - md) / MOUSE_DIST * 0.018;
          p.x += (mdx / md) * force * 8;
          p.y += (mdy / md) * force * 8;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + GOLD_RGB + ',' + p.a + ')'; ctx.fill();
      }
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONN_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + GOLD_RGB + ',' + (0.055 * (1 - dist / CONN_DIST)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ── MAGNETIC BUTTONS ── */
  /* Gold CTA buttons subtly attract cursor when nearby */
  function initMagneticButtons() {
    if (window.innerWidth < 768) return; /* desktop only */
    var btns = document.querySelectorAll('.btn-gold, .nav-cta, .btn-gold-lg');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r   = btn.getBoundingClientRect();
        var cx  = r.left + r.width  / 2;
        var cy  = r.top  + r.height / 2;
        var dx  = (e.clientX - cx) * 0.28;
        var dy  = (e.clientY - cy) * 0.28;
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
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
