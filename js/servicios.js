/* Servicios v4: un video a la vez, rótulos ligados a video.currentTime, avance automático al cerrar el ciclo. */
!function(){
  var S=document.getElementById('servicios');if(!S)return;
  var G=S.querySelector('.sv-grid'),M=S.querySelector('.sv-marco');if(!G||!M)return;
  var H=document.documentElement,F=[].slice.call(S.querySelectorAll('.sv-fila')),E=[].slice.call(S.querySelectorAll('.sv-esc'));
  var B='assets/web/servicios3d/',cn=navigator.connection,dm=navigator.deviceMemory;
  var Q=matchMedia('(prefers-reduced-motion: reduce)').matches||H.classList.contains('quieto')||H.classList.contains('webview')||/[?&]estatico/.test(location.search)||!!(cn&&cn.saveData)||(H.classList.contains('ligero')&&dm&&dm<=2)||!('IntersectionObserver' in window);
  var act=0,cargado=false,visible=false,fijo=false,raf=0;
  G.classList.add('sv-js');G.classList.add(Q?'sv-quieto':'sv-mov');

  E.forEach(function(e,i){
    var n=e.getAttribute('data-n'),pic=document.createElement('picture'),so=document.createElement('source'),im=document.createElement('img');
    so.type='image/avif';so.setAttribute('data-srcset',B+n+'-poster.avif?v=3');
    im.setAttribute('data-src',B+n+'-poster.webp?v=3');im.width=960;im.height=540;im.alt='';im.decoding='async';
    pic.appendChild(so);pic.appendChild(im);e.insertBefore(pic,e.firstChild);
    var rot=document.createElement('div');rot.className='sv-rot';
    e._r=[].map.call(F[i]?F[i].querySelectorAll('li'):[],function(li){var s=document.createElement('span');s.textContent=li.textContent;rot.appendChild(s);return s});
    e.appendChild(rot);
    if(Q)return;
    var v=document.createElement('video');
    v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.setAttribute('muted','');v.setAttribute('playsinline','');
    v.setAttribute('aria-hidden','true');v.tabIndex=-1;v.width=960;v.height=540;v.disablePictureInPicture=true;
    v.addEventListener('playing',function(){v.classList.add('vivo');pulso()});
    e._v=v;e.insertBefore(v,rot);
  });

  function fuentes(e){var v=e&&e._v;if(!v||v._ok)return;v._ok=1;[['webm','video/webm'],['mp4','video/mp4']].forEach(function(t){var s=document.createElement('source');s.src=B+e.getAttribute('data-n')+'.'+t[0]+'?v=3';s.type=t[1];v.appendChild(s)});v.load()}
  function sig(i){return (i+1)%E.length}

  /* un solo rAF, vivo solo mientras el video activo está en pantalla y sonando */
  function pulso(){if(!raf)raf=requestAnimationFrame(cuadro)}
  function cuadro(){
    raf=0;var e=E[act],v=e._v;if(!v||!visible||v.paused)return;
    var d=v.duration||10,t=v.currentTime,n=e._r.length;
    if(v._t!=null&&t<v._t-1&&!fijo){v._t=null;ir(sig(act));return}
    v._t=t;
    var x=t/d*n,k=Math.floor(x),u=x-k;
    e._r.forEach(function(s,j){var on=j===k&&u>.06&&u<.94;if(s._on!==on){s._on=on;s.classList.toggle('on',on)}});
    var p=F[act]&&F[act].querySelector('.sv-prog');if(p)p.style.transform='scaleX('+Math.min(1,t/d).toFixed(4)+')';
    raf=requestAnimationFrame(cuadro);
  }
  function sonar(){
    E.forEach(function(e,i){var v=e._v;if(!v)return;if(i===act&&visible){fuentes(e);var r=v.play();r&&r.catch&&r.catch(function(){})}else if(!v.paused)v.pause()});
  }
  function ir(i,inicio){
    if(i===act&&!inicio)return;
    var prev=F[act]&&F[act].querySelector('.sv-prog');if(prev&&!Q)prev.style.transform='scaleX(0)';
    act=i;
    F.forEach(function(f,j){f.classList.toggle('es-activa',j===i);f.setAttribute('aria-current',j===i?'true':'false')});
    E.forEach(function(e,j){e.classList.toggle('es-activa',j===i)});
    var e=E[i];e._r.forEach(function(s){s._on=false;s.classList.remove('on')});
    if(e._v){e._v._t=null;try{e._v.currentTime=0}catch(_){}}
    sonar();
    if(!Q&&cargado){var nx=E[sig(i)];setTimeout(function(){if(act===i)fuentes(nx)},2500)}
  }

  new IntersectionObserver(function(en){
    if(!en[0].isIntersecting||cargado)return;cargado=true;
    E.forEach(function(e){var s=e.querySelector('source[data-srcset]'),im=e.querySelector('img[data-src]');if(s){s.srcset=s.getAttribute('data-srcset');s.removeAttribute('data-srcset')}if(im){im.src=im.getAttribute('data-src');im.removeAttribute('data-src')}});
    if(!Q)fuentes(E[act]);
  },{rootMargin:'100% 0px'}).observe(S);
  new IntersectionObserver(function(en){visible=en[0].isIntersecting;sonar();if(visible)pulso()},{threshold:.35}).observe(M);
  document.addEventListener('visibilitychange',function(){if(document.hidden){E.forEach(function(e){e._v&&!e._v.paused&&e._v.pause()})}else sonar()});

  F.forEach(function(f,i){
    f.addEventListener('click',function(ev){
      if(ev.target.closest('a'))return;
      fijo=true;ir(i);
      var r=M.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)M.scrollIntoView({block:'center',behavior:Q?'auto':'smooth'});
    });
    f.addEventListener('focusin',function(){fijo=true;ir(i)});
  });
  ir(0,true);
}();
