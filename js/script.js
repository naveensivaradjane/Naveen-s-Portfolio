/* ============================================================
   NAVEEN S · Portfolio · script.js — Enhanced
   ============================================================ */
(function(){
  'use strict';

  /* ── Particles ── */
  var pts = document.getElementById('hpts');
  if(pts){
    var cl=['rgba(0,245,212,.8)','rgba(168,85,247,.8)','rgba(255,45,120,.7)','rgba(0,255,136,.7)','rgba(255,214,10,.6)'];
    var frag=document.createDocumentFragment();
    for(var i=0;i<36;i++){
      var d=document.createElement('div'),sz=(Math.random()*3.5+1.5).toFixed(1);
      d.className='pt';
      d.style.cssText=['width:'+sz+'px','height:'+sz+'px','background:'+cl[i%cl.length],'left:'+(Math.random()*100).toFixed(2)+'%','animation-duration:'+(Math.random()*14+8).toFixed(1)+'s','animation-delay:-'+(Math.random()*22).toFixed(1)+'s'].join(';');
      frag.appendChild(d);
    }
    pts.appendChild(frag);
  }

  /* ── Ticker duplicate ── */
  var tt=document.getElementById('ttrack');
  if(tt) tt.innerHTML+=tt.innerHTML;

  /* ── Sticky nav ── */
  var nb=document.getElementById('nbar');
  window.addEventListener('scroll',function(){if(nb) nb.classList.toggle('stuck',window.scrollY>55);},{passive:true});

  /* ── Burger menu ── */
  var bg=document.getElementById('burg'),mob=document.getElementById('mob');
  if(bg&&mob){
    bg.addEventListener('click',function(){
      var o=bg.classList.toggle('open');
      mob.classList.toggle('open',o);
      document.body.style.overflow=o?'hidden':'';
      bg.setAttribute('aria-expanded',o);
    });
    mob.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){bg.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';});
    });
    mob.addEventListener('click',function(e){if(e.target===mob){bg.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mob.classList.contains('open')){bg.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}});
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll("a[href^='#']").forEach(function(a){
    a.addEventListener('click',function(e){
      var href=a.getAttribute('href');if(href==='#') return;
      var t=document.querySelector(href);if(!t) return;
      e.preventDefault();
      var off=(nb?nb.offsetHeight:0)+16;
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-off,behavior:'smooth'});
    });
  });

  /* ── Active nav links ── */
  var nls=document.querySelectorAll('.nlinks a');
  document.querySelectorAll('section[id]').forEach(function(s){
    new IntersectionObserver(function(en){
      en.forEach(function(e){if(e.isIntersecting) nls.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id);});});
    },{threshold:.32}).observe(s);
  });

  /* ── Skill bars ── */
  var skObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('bon');skObs.unobserve(e.target);}});
  },{threshold:.18});
  document.querySelectorAll('.ski').forEach(function(el){skObs.observe(el);});

  /* ── Counter animation ── */
  function countUp(el){
    var txt=el.textContent.trim(),hasPlus=txt.endsWith('+'),hasPct=txt.endsWith('%');
    var n=parseFloat(txt.replace(/[^0-9.]/g,''));if(isNaN(n)||(/[A-Z]/.test(txt)&&!/^\d/.test(txt))) return;
    var cur=0,timer=setInterval(function(){cur+=n/80;if(cur>=n){cur=n;clearInterval(timer);}el.textContent=Math.round(cur)+(hasPlus?'+':(hasPct?'%':''));},18);
  }
  var cntObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){countUp(e.target);cntObs.unobserve(e.target);}});
  },{threshold:.65});
  document.querySelectorAll('.hst-n,.aps-n').forEach(function(el){cntObs.observe(el);});

  /* ══════════════════════════════════════
     PROJECTS — HORIZONTAL SCROLL
     Arrow buttons + drag + dots
     ══════════════════════════════════════ */
  var track=document.getElementById('projTrack');
  var btnL=document.getElementById('projLeft');
  var btnR=document.getElementById('projRight');
  var dots=document.querySelectorAll('.pdot');
  var cards=track?track.querySelectorAll('.pcard'):[];

  function getCardWidth(){
    if(!cards.length) return 0;
    var c=cards[0];
    return c.offsetWidth+parseInt(getComputedStyle(track).gap||'0');
  }

  function updateDots(){
    if(!track||!dots.length) return;
    var scrollLeft=track.scrollLeft;
    var cw=getCardWidth();
    var idx=cw>0?Math.round(scrollLeft/cw):0;
    idx=Math.max(0,Math.min(idx,dots.length-1));
    dots.forEach(function(d,i){d.classList.toggle('active',i===idx);});
  }

  function updateArrows(){
    if(!track||!btnL||!btnR) return;
    btnL.disabled=track.scrollLeft<=4;
    btnR.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-4;
  }

  if(track){
    /* Arrow buttons */
    if(btnL) btnL.addEventListener('click',function(){track.scrollBy({left:-getCardWidth(),behavior:'smooth'});});
    if(btnR) btnR.addEventListener('click',function(){track.scrollBy({left:getCardWidth(),behavior:'smooth'});});

    /* Dot buttons */
    dots.forEach(function(d){
      d.addEventListener('click',function(){
        var idx=parseInt(d.getAttribute('data-idx')||'0');
        track.scrollTo({left:getCardWidth()*idx,behavior:'smooth'});
      });
    });

    /* Track scroll events */
    track.addEventListener('scroll',function(){updateDots();updateArrows();},{passive:true});

    /* Initial state */
    updateArrows();
    updateDots();

    /* ── Drag to scroll (mouse) ── */
    var isDragging=false,startX=0,scrollStart=0;
    track.addEventListener('mousedown',function(e){isDragging=true;startX=e.pageX;scrollStart=track.scrollLeft;track.style.userSelect='none';});
    window.addEventListener('mousemove',function(e){if(!isDragging) return;e.preventDefault();track.scrollLeft=scrollStart-(e.pageX-startX);},{passive:false});
    window.addEventListener('mouseup',function(){if(isDragging){isDragging=false;track.style.userSelect='';updateDots();updateArrows();}});

    /* ── Touch already handled by CSS scroll-snap ── */
    track.addEventListener('touchend',function(){setTimeout(function(){updateDots();updateArrows();},200);},{passive:true});
  }

  /* ── 3D card tilt (desktop only) ── */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.pcard,.ecard').forEach(function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*8,y=-((e.clientY-r.top)/r.height-.5)*8;
        c.style.transition='transform .07s linear';
        c.style.transform='perspective(900px) rotateY('+x+'deg) rotateX('+y+'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave',function(){
        c.style.transition='transform .5s cubic-bezier(.34,1.56,.64,1)';
        c.style.transform='translateY(0)';
      });
    });

    /* Cursor glow */
    var cg=document.getElementById('cglow');
    if(cg) document.addEventListener('mousemove',function(e){cg.style.left=e.clientX+'px';cg.style.top=e.clientY+'px';},{passive:true});
  }

  /* ── Contact form ── */
  var cfbtn=document.getElementById('cfbtn'),cfok=document.getElementById('cfok');
  if(cfbtn&&cfok){
    cfbtn.addEventListener('click',function(){
      var fn=(document.getElementById('fn')||{}).value||'';
      var fe=(document.getElementById('fe')||{}).value||'';
      var fm=(document.getElementById('fm')||{}).value||'';
      if(!fn.trim()||!fe.trim()||!fm.trim()){cfbtn.style.animation='none';void cfbtn.offsetWidth;cfbtn.style.animation='shake .4s ease';return;}
      var orig=cfbtn.innerHTML;cfbtn.textContent='Sending…';cfbtn.disabled=true;
      setTimeout(function(){
        ['fn','fe','fs','fm'].forEach(function(id){var el=document.getElementById(id);if(el) el.value='';});
        cfbtn.innerHTML=orig;cfbtn.disabled=false;cfok.classList.add('show');
        setTimeout(function(){cfok.classList.remove('show');},5200);
      },1400);
    });
  }

  /* ── Fade-in on scroll ── */
  var fadeEls=document.querySelectorAll('.pcard,.ecard,.cert,.tech');
  if('IntersectionObserver' in window&&fadeEls.length){
    fadeEls.forEach(function(el){el.style.opacity='0';el.style.transform='translateY(14px)';el.style.transition='opacity .5s ease, transform .5s ease';});
    var fo=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';fo.unobserve(e.target);}});
    },{threshold:.06});
    fadeEls.forEach(function(el){fo.observe(el);});
  }

})();