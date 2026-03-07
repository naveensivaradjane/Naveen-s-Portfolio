/* ============================================================
   NAVEEN S · Portfolio · script.js
   ============================================================ */
(function () {
    'use strict';

    /* Particles */
    var pts = document.getElementById('hpts');
    if (pts) {
        var cl = ['rgba(0,245,212,.8)', 'rgba(168,85,247,.8)', 'rgba(255,45,120,.7)', 'rgba(0,255,136,.7)', 'rgba(255,214,10,.6)'];
        var frag = document.createDocumentFragment();
        for (var i = 0; i < 36; i++) {
            var d = document.createElement('div'), sz = (Math.random() * 3.5 + 1.5).toFixed(1);
            d.className = 'pt';
            d.style.cssText = ['width:' + sz + 'px', 'height:' + sz + 'px', 'background:' + cl[i % cl.length], 'left:' + (Math.random() * 100).toFixed(2) + '%', 'animation-duration:' + (Math.random() * 14 + 8).toFixed(1) + 's', 'animation-delay:-' + (Math.random() * 22).toFixed(1) + 's'].join(';');
            frag.appendChild(d);
        }
        pts.appendChild(frag);
    }

    /* Ticker */
    var tt = document.getElementById('ttrack');
    if (tt) tt.innerHTML += tt.innerHTML;

    /* Sticky nav */
    var nb = document.getElementById('nbar');
    window.addEventListener('scroll', function () { if (nb) nb.classList.toggle('stuck', window.scrollY > 55); }, { passive: true });

    /* Burger */
    var bg = document.getElementById('burg'), mob = document.getElementById('mob');
    if (bg && mob) {
        bg.addEventListener('click', function () {
            var o = bg.classList.toggle('open');
            mob.classList.toggle('open', o);
            document.body.style.overflow = o ? 'hidden' : '';
            bg.setAttribute('aria-expanded', o);
        });
        mob.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                bg.classList.remove('open'); mob.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
        mob.addEventListener('click', function (e) { if (e.target === mob) { bg.classList.remove('open'); mob.classList.remove('open'); document.body.style.overflow = ''; } });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mob.classList.contains('open')) { bg.classList.remove('open'); mob.classList.remove('open'); document.body.style.overflow = ''; } });
    }

    /* Smooth scroll */
    document.querySelectorAll("a[href^='#']").forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = a.getAttribute('href'); if (href === '#') return;
            var t = document.querySelector(href); if (!t) return;
            e.preventDefault();
            var off = (nb ? nb.offsetHeight : 0) + 16;
            window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
        });
    });

    /* Active nav */
    var nls = document.querySelectorAll('.nlinks a');
    document.querySelectorAll('section[id]').forEach(function (s) {
        new IntersectionObserver(function (en) {
            en.forEach(function (e) { if (e.isIntersecting) nls.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
        }, { threshold: .32 }).observe(s);
    });

    /* Skill bars */
    var skObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('bon'); skObs.unobserve(e.target); } });
    }, { threshold: .18 });
    document.querySelectorAll('.ski').forEach(function (el) { skObs.observe(el); });

    /* Counter */
    function countUp(el) {
        var txt = el.textContent.trim(), hasPlus = txt.endsWith('+'), hasPct = txt.endsWith('%');
        var n = parseFloat(txt.replace(/[^0-9.]/g, '')); if (isNaN(n) || /[A-Z]/.test(txt) && !/^\d/.test(txt)) return;
        var cur = 0, timer = setInterval(function () { cur += n / 80; if (cur >= n) { cur = n; clearInterval(timer); } el.textContent = Math.round(cur) + (hasPlus ? '+' : (hasPct ? '%' : '')); }, 18);
    }
    var cntObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cntObs.unobserve(e.target); } });
    }, { threshold: .65 });
    document.querySelectorAll('.hst-n,.aps-n').forEach(function (el) { cntObs.observe(el); });

    /* 3D card tilt (desktop) */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        document.querySelectorAll('.wcard,.ecard').forEach(function (c) {
            c.addEventListener('mousemove', function (e) {
                var r = c.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width - .5) * 9, y = -((e.clientY - r.top) / r.height - .5) * 9;
                c.style.transition = 'transform .07s linear';
                c.style.transform = 'perspective(900px) rotateY(' + x + 'deg) rotateX(' + y + 'deg) translateY(-8px)';
            });
            c.addEventListener('mouseleave', function () {
                c.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
                c.style.transform = 'translateY(0)';
            });
        });
        /* Cursor glow */
        var cg = document.getElementById('cglow');
        if (cg) document.addEventListener('mousemove', function (e) { cg.style.left = e.clientX + 'px'; cg.style.top = e.clientY + 'px'; }, { passive: true });
    }

    /* Contact form */
    var cfbtn = document.getElementById('cfbtn'), cfok = document.getElementById('cfok');
    if (cfbtn && cfok) {
        cfbtn.addEventListener('click', function () {
            var fn = (document.getElementById('fn') || {}).value || '', fe = (document.getElementById('fe') || {}).value || '', fm = (document.getElementById('fm') || {}).value || '';
            if (!fn.trim() || !fe.trim() || !fm.trim()) { cfbtn.style.animation = 'none'; void cfbtn.offsetWidth; cfbtn.style.animation = 'shake .4s ease'; return; }
            var orig = cfbtn.innerHTML; cfbtn.textContent = 'Sending…'; cfbtn.disabled = true;
            setTimeout(function () {
                ['fn', 'fe', 'fs', 'fm'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
                cfbtn.innerHTML = orig; cfbtn.disabled = false; cfok.classList.add('show');
                setTimeout(function () { cfok.classList.remove('show'); }, 5200);
            }, 1400);
        });
    }

    /* Fade-in cards */
    var fadeEls = document.querySelectorAll('.wcard,.ecard,.cert,.tech');
    if ('IntersectionObserver' in window && fadeEls.length) {
        fadeEls.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(14px)'; el.style.transition = 'opacity .5s ease, transform .5s ease'; });
        var fo = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; fo.unobserve(e.target); } });
        }, { threshold: .08 });
        fadeEls.forEach(function (el) { fo.observe(el); });
    }

})();