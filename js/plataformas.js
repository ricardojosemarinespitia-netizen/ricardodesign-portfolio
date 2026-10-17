/* Plataformas y marcas · v3 · 2026-10-17
   Escena viva: rd en cromo que se gira arrastrando (72 cuadros de Blender Cycles en un Canvas 2D, con inercia,
   reflejo de estudio que sigue al puntero, barrido de luz, respiración, chispas y tinte del color de la plataforma activa)
   + 10 medallas DOM con relieve 3D en una órbita con profundidad (las de atrás pasan detrás del rd, más chicas y desenfocadas).
   Hover/toque/foco: la medalla se levanta y se inclina hacia el puntero, el logo pasa al color oficial, halo, pulso por el hilo
   hasta el rd, el rd toma ese color, la órbita frena y las demás se atenúan.
   Reglas: un solo reloj (gsap.ticker si existe; si no, un rAF propio), nada corre fuera de pantalla (IO), solo transform/opacity
   en el DOM. Versión ligera (táctil, WebView de Instagram/Facebook, ?estatico, reducido, ahorro de datos): sin cuadros ni
   Canvas ni bucle; póster fijo, medallas quietas y el mismo efecto de color al tocar. */
(function(){
  'use strict';
  var root=document.documentElement;
  var sec=document.getElementById('plataformas');if(!sec||!('IntersectionObserver' in window))return;
  var escena=sec.querySelector('.pl-escena'),rd=sec.querySelector('.pl-rd'),lienzo=sec.querySelector('.pl-rd__lienzo');
  var fondo=sec.querySelector('.pl-fondo'),orbe=sec.querySelector('.pl-orbe');
  var gAtras=sec.querySelector('.pl-hilos--atras g'),gFrente=sec.querySelector('.pl-hilos--frente g');
  var fichas=[].slice.call(sec.querySelectorAll('.pl-ficha')),n=fichas.length;
  var marquee=sec.querySelector('.plt-marquee');
  var quieto=root.classList.contains('quieto');
  var con=navigator.connection||{};
  var fino=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var ligero=quieto||root.classList.contains('webview')||/Instagram|FBAN|FBAV/.test(navigator.userAgent)||con.saveData||!fino||!matchMedia('(min-width:901px)').matches;
  if(ligero)escena.classList.add('es-ligero');
  var TAU=Math.PI*2,NS='http://www.w3.org/2000/svg';

  /* ---- hilos: base (atrás y adelante), chispas de energía y pulso de la activa ---- */
  function trazo(g,cl){var p=document.createElementNS(NS,'path');p.setAttribute('class',cl);p.setAttribute('pathLength','100');g.appendChild(p);return p}
  var hilos=[];
  function crearHilos(){
    hilos=fichas.map(function(f){
    var h={a:trazo(gAtras,'pl-hilo'),f:trazo(gFrente,'pl-hilo'),c:ligero?null:trazo(gFrente,'pl-chispas'),p:trazo(gFrente,'pl-pulso')};
    var c=getComputedStyle(f).getPropertyValue('--marca').trim();h.p.style.setProperty('--c',c);h.f.style.setProperty('--c',c);h.color=c;return h;
  });
  }

  /* ---- medidas ---- */
  var W=0,H=0,cx=0,cy=0,rx=0,ry=0,S=0;
  function medir(){
    W=escena.clientWidth;H=escena.clientHeight;S=rd.clientWidth;
    cx=W*0.5;cy=rd.offsetTop+S*0.54;rx=W*0.43;ry=W*0.17;
    if(orbe){orbe.setAttribute('cx',cx.toFixed(1));orbe.setAttribute('cy',cy.toFixed(1));orbe.setAttribute('rx',rx.toFixed(1));orbe.setAttribute('ry',ry.toFixed(1))}
    pintar(reloj);
  }

  /* ---- estado ---- */
  var reloj=0,giro=-0.4,vel=0.085,velObj=0.085,entrada=ligero?1:0,activa=-1;
  var px=0,py=0,tx=0,ty=0,prog=0;
  function ease(x){x=x<0?0:x>1?1:x;return 1-Math.pow(1-x,3)}

  function pintar(t){
    if(!W)return;
    var inc=px*0.07,ci=Math.cos(inc),si=Math.sin(inc);
    var ryy=ry*(1+py*0.18+prog*0.35);           /* el scroll y el puntero cambian la inclinación de la órbita */
    var sy=prog*-26;
    for(var i=0;i<n;i++){
      var a=giro+TAU*i/n,c=Math.cos(a),s=Math.sin(a);
      var e=ligero?1:ease(entrada*1.9-0.45-i*0.07);
      var x=c*rx*e,y=s*ryy*e+(ligero?0:Math.sin(t*1.1+i*1.7)*W*0.006);
      var X=x*ci-y*si+px*W*0.022,Y=x*si+y*ci;
      var d=(s+1)/2,esc=(0.7+0.38*d)*(0.4+0.6*e);
      var f=fichas[i];
      f.style.transform='translate3d('+(X+cx-W*0.5).toFixed(1)+'px,'+(Y+cy-H*0.5+sy).toFixed(1)+'px,0) scale('+esc.toFixed(3)+')';
      f.style.opacity=Math.min(1,e*1.5).toFixed(3);
      var lado=X+cx>W*0.8?2:X+cx<W*0.2?1:0;if(f._l!==lado){f.classList.toggle('lbl-der',lado===2);f.classList.toggle('lbl-izq',lado===1);f._l=lado}
      var del=s>-0.12,z=del?5:1;
      if(f._z!==z){f.style.zIndex=z;f._z=z;f.classList.toggle('es-fondo',!del)}
      /* hilo del borde del rd a la medalla, con comba */
      var x0=cx+c*S*0.26+px*-W*0.012,y0=cy+s*S*0.12+sy*0.6-S*0.05,x1=cx+X,y1=cy+Y+sy;
      var qx=(x0+x1)/2,qy=(y0+y1)/2+W*0.035;
      var dd='M'+x1.toFixed(1)+' '+y1.toFixed(1)+'Q'+qx.toFixed(1)+' '+qy.toFixed(1)+' '+x0.toFixed(1)+' '+y0.toFixed(1);
      var h=hilos[i],vis=Math.max(0,Math.min(1,e*1.6-0.6)),act=i===activa;
      if(h._d!==dd){h.a.setAttribute('d',dd);h.f.setAttribute('d',dd);h.p.setAttribute('d',dd);if(h.c)h.c.setAttribute('d',dd);h._d=dd}
      h.a.style.opacity=del?0:(vis*0.45).toFixed(3);
      h.f.style.opacity=del||act?(act?1:vis*0.55).toFixed(3):0;
      h.f.style.strokeDashoffset=((1-vis)*100).toFixed(1);h.a.style.strokeDashoffset=h.f.style.strokeDashoffset;
      h.f.style.strokeDasharray=h.a.style.strokeDasharray='100';
      if(h.c)h.c.style.opacity=(del?vis*(activa>-1&&!act?0.15:0.6):0).toFixed(3);
    }
    if(fondo){fondo.style.setProperty('--fx',(px*-6).toFixed(1)+'px');fondo.style.setProperty('--fy',(py*-5+sy*0.3).toFixed(1)+'px')}
    var resp=ligero?0:Math.sin(t*1.3)*0.012;
    rd.style.transform='translate3d('+(px*-10).toFixed(1)+'px,'+(sy*0.6+py*-6+(ligero?0:Math.sin(t*0.7)*3)).toFixed(1)+'px,0) scale('+(1+resp).toFixed(4)+')';
  }

  /* ======================= rd vivo (Canvas 2D) ======================= */
  var cuadros=[],cargados=0,N=+rd.getAttribute('data-n')||72,ctx=null,ang=0,angVel=0,arrastre=null,ultimoCuadro=-1,brillo=-1,tinte=0,tinteC='',chispas=[];
  function cargarCuadros(){
    if(ligero||cuadros.length||!lienzo.getContext)return;
    var base=rd.getAttribute('data-giro');ctx=lienzo.getContext('2d');
    var orden=[];for(var k=0;k<N;k+=6)orden.push(k);for(k=0;k<N;k++)if(k%6)orden.push(k);   /* primero uno de cada 6: gira pronto */
    for(var i=0;i<N;i++)cuadros.push(null);
    var cola=orden.slice(),vivos=0;
    function sigue(){while(vivos<6&&cola.length){(function(k){vivos++;var im=new Image();im.decoding='async';
      im.onload=function(){cuadros[k]=im;cargados++;if(k===0)rd.classList.add('es-vivo');vivos--;sigue()};
      im.onerror=function(){vivos--;sigue()};im.src=base+(k<10?'0':'')+k+'.webp'})(cola.shift())}}
    sigue();   /* 6 a la vez: no satura la red ni el servidor */
    for(i=0;i<26;i++)chispas.push({a:Math.random()*TAU,r:0.25+Math.random()*0.25,v:0.15+Math.random()*0.35,f:Math.random(),z:Math.random()});
  }
  function cuadroMasCercano(k){
    if(cuadros[k])return cuadros[k];
    for(var d=1;d<N/2;d++){var a=cuadros[(k+d)%N]||cuadros[(k-d+N)%N];if(a)return a}
    return null;
  }
  function pintarRd(t,dt){
    if(!ctx)return;
    /* ángulo: arrastre con inercia; en reposo busca el frente y se mece y mira hacia el puntero */
    if(!arrastre){
      angVel*=Math.pow(0.04,dt);
      var objetivo=Math.round(ang/360)*360+px*28+Math.sin(t*0.45)*10*(1-entrada*0)+(entrada<1?(1-ease(entrada))*-200:0);
      if(Math.abs(angVel)<40)ang+=(objetivo-ang)*Math.min(1,dt*1.6);
      ang+=angVel*dt;
    }
    var k=((Math.round(ang/(360/N))%N)+N)%N;
    var w=lienzo.width,h=lienzo.height,im=cuadroMasCercano(k);if(!im)return;
    tinte+=((activa>-1?1:0)-tinte)*Math.min(1,dt*6);if(activa>-1)tinteC=hilos[activa].color;
    var barr=(t%7)/7;
    ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);ctx.drawImage(im,0,0,w,h);
    ctx.globalCompositeOperation='source-atop';
    /* reflejo de estudio que sigue al puntero */
    var lx=w*(0.5+px*0.35),ly=h*(0.35+py*0.25),g=ctx.createRadialGradient(lx,ly,0,lx,ly,w*0.38);
    g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    /* barrido de luz diagonal cada 7 s */
    if(barr<0.32){var bx=(barr/0.32)*w*1.8-w*0.4,lg=ctx.createLinearGradient(bx-w*0.12,0,bx+w*0.12,h*0.3);
      lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(0.5,'rgba(255,255,255,.7)');lg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,w,h)}
    /* el rd refleja el color de la plataforma activa */
    if(tinte>0.01&&tinteC){ctx.globalAlpha=tinte*0.55;var tg=ctx.createRadialGradient(w*0.5,h*0.55,0,w*0.5,h*0.55,w*0.55);
      tg.addColorStop(0,tinteC);tg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=tg;ctx.globalCompositeOperation='source-atop';ctx.fillRect(0,0,w,h);ctx.globalAlpha=1}
    /* chispas que suben alrededor */
    ctx.globalCompositeOperation='source-over';
    for(var i=0;i<chispas.length;i++){var c=chispas[i];c.f+=dt*c.v*0.25;if(c.f>1){c.f=0;c.a=Math.random()*TAU}
      var r=c.r*w,xx=w*0.5+Math.cos(c.a+t*0.2)*r,yy=h*(0.78-c.f*0.6)+Math.sin(c.a)*r*0.25,al=Math.sin(c.f*Math.PI)*0.55;
      ctx.globalAlpha=al;ctx.fillStyle=tinte>0.3&&tinteC?tinteC:'#9A9A9A';ctx.beginPath();ctx.arc(xx,yy,1+c.z*1.6,0,TAU);ctx.fill()}
    ctx.globalAlpha=1;
    /* sombra viva: se estrecha cuando el rd está de canto */
    var canto=Math.abs(Math.sin(ang*Math.PI/180));rd.style.setProperty('--ax',(1-canto*0.55).toFixed(3));rd.style.setProperty('--ao',(0.75-canto*0.3).toFixed(3));
  }
  /* arrastre: horizontal gira; vertical deja hacer scroll (touch-action:pan-y) */
  rd.addEventListener('pointerdown',function(e){if(ligero)return;arrastre={x:e.clientX,a:ang,t:performance.now(),lx:e.clientX};rd.classList.add('es-arrastre');try{rd.setPointerCapture(e.pointerId)}catch(_){}});
  rd.addEventListener('pointermove',function(e){if(!arrastre)return;var now=performance.now(),dx=e.clientX-arrastre.lx,dtm=Math.max(8,now-arrastre.t);
    ang=arrastre.a+(e.clientX-arrastre.x)*0.9;angVel=angVel*0.6+(dx*0.9/(dtm/1000))*0.4;arrastre.lx=e.clientX;arrastre.t=now});
  function soltar(){if(!arrastre)return;arrastre=null;rd.classList.remove('es-arrastre')}
  rd.addEventListener('pointerup',soltar);rd.addEventListener('pointercancel',soltar);
  if(!ligero){rd.tabIndex=0;rd.setAttribute('aria-label','Monograma rd de Ricardo Design en cromo; gíralo con las flechas o arrastrándolo');
    rd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){angVel+=(e.key==='ArrowLeft'?-1:1)*420;e.preventDefault()}})}

  /* ======================= rd ligero (celular, Instagram/FB, ahorro de datos) =======================
     Sin Canvas ni bucle permanente: una hoja de 24 cuadros (rejilla 6x4, AVIF 62 KB / WebP 109 KB) que se pide al primer
     toque del rd; mientras llega, el póster se inclina con el dedo. Inercia con rAF solo mientras se mueve; al soltar
     vuelve al frente. Fuera solo en ?estatico y movimiento reducido (html.quieto). */
  if(ligero&&!quieto){
    var hoja=null,lAng=0,lVel=0,lArr=null,lRaf=0,lUlt=0,lK=-1,M=24;
    escena.classList.add('es-girable');
    function pedirHoja(){if(hoja)return;hoja=document.createElement('span');hoja.className='pl-rd__hoja';hoja.setAttribute('aria-hidden','true');
      var src=rd.getAttribute('data-hoja'),im=new Image();
      im.onload=function(){hoja.style.backgroundImage='url("'+im.currentSrc+'")';rd.appendChild(hoja);lK=-1;lPinta();rd.classList.add('es-hoja')};
      var pic=document.createElement('picture'),so=document.createElement('source');so.type='image/avif';so.srcset=src+'.avif';pic.appendChild(so);im.decoding='async';im.src=src+'.webp';pic.appendChild(im)}
    function lPinta(){
      if(rd.classList.contains('es-hoja')){var k=((Math.round(lAng/(360/M))%M)+M)%M;if(k!==lK){lK=k;hoja.style.backgroundPosition=(k%6)*20+'% '+((k/6|0)*100/3).toFixed(3)+'%'}rd.style.removeProperty('--pl-ry')}
      else rd.style.setProperty('--pl-ry',Math.max(-28,Math.min(28,lAng*0.25)).toFixed(1)+'deg');
    }
    function lPaso(ms){var dt=Math.min(0.05,(ms-lUlt)/1000||0.016);lUlt=ms;
      if(!lArr){lVel*=Math.pow(0.05,dt);lAng+=lVel*dt;if(Math.abs(lVel)<60){var o=Math.round(lAng/360)*360;lAng+=(o-lAng)*Math.min(1,dt*3.2)}}
      lPinta();if(lArr||Math.abs(lVel)>2||Math.abs(lAng-Math.round(lAng/360)*360)>0.5)lRaf=requestAnimationFrame(lPaso);else{lRaf=0;lAng=Math.round(lAng/360)*360;lPinta()}}
    function lMover(){if(!lRaf){lUlt=performance.now();lRaf=requestAnimationFrame(lPaso)}}
    rd.addEventListener('pointerdown',function(e){pedirHoja();lArr={x:e.clientX,a:lAng,lx:e.clientX,t:performance.now()};lVel=0;rd.classList.add('es-arrastre');escena.classList.add('ya-girado');lMover()});
    rd.addEventListener('pointermove',function(e){if(!lArr)return;var now=performance.now(),dtm=Math.max(8,now-lArr.t);
      lAng=lArr.a+(e.clientX-lArr.x)*1.1;lVel=lVel*0.5+((e.clientX-lArr.lx)*1.1/(dtm/1000))*0.5;lArr.lx=e.clientX;lArr.t=now});
    function lSoltar(){if(!lArr)return;lArr=null;rd.classList.remove('es-arrastre');lMover()}
    rd.addEventListener('pointerup',lSoltar);rd.addEventListener('pointercancel',lSoltar);
    rd.tabIndex=0;rd.setAttribute('aria-label','Monograma rd de Ricardo Design en cromo; gíralo con las flechas o deslizando el dedo');
    rd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){pedirHoja();lVel+=(e.key==='ArrowLeft'?-1:1)*520;lMover();e.preventDefault()}});
  }

  /* ======================= reloj único ======================= */
  var corriendo=false,usaGsap=false,ultimo=0,rafId=0,t0=0;
  function paso(ms){
    var dt=Math.min(0.05,(ms-ultimo)/1000||0.016);ultimo=ms;reloj+=dt;
    if(entrada<1){var ahora=performance.now();if(!t0)t0=ahora;entrada=Math.min(1,(ahora-t0)/2400)}   /* por reloj real: no se atasca si el equipo va lento */
    vel+=(velObj-vel)*Math.min(1,dt*3);giro+=vel*dt;
    px+=(tx-px)*Math.min(1,dt*5);py+=(ty-py)*Math.min(1,dt*5);
    var r=sec.getBoundingClientRect(),vh=innerHeight;
    prog=Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/vh));     /* -1 saliendo arriba, 0 centrada, 1 entrando */
    pintar(reloj);pintarRd(reloj,dt);
  }
  function tickGsap(time){paso(time*1000)}
  function tickRaf(ms){paso(ms);rafId=requestAnimationFrame(tickRaf)}
  function arrancar(){
    if(corriendo||ligero||document.hidden)return;corriendo=true;ultimo=performance.now();
    usaGsap=!!(window.gsap&&gsap.ticker);
    if(usaGsap)gsap.ticker.add(tickGsap);else rafId=requestAnimationFrame(tickRaf);
  }
  function parar(){if(!corriendo)return;corriendo=false;if(usaGsap)gsap.ticker.remove(tickGsap);else cancelAnimationFrame(rafId)}

  /* ======================= cursor propio del sitio (sitio.min.js mueve .cursor) =======================
     Sobre una medalla el aro se encoge a un punto del color de la marca (no tapa la medalla);
     sobre el rd se vuelve un aro punteado de "girar". */
  var cur=document.querySelector('.cursor');
  function cursor(modo,color){if(!cur)return;cur.classList.toggle('pl-sobre',modo===1);cur.classList.toggle('pl-gira',modo===2);if(color)cur.style.setProperty('--pl-cursor',color)}
  if(cur){rd.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')cursor(2)});rd.addEventListener('pointerleave',function(){cursor(0)})}

  /* ======================= interacción de medallas ======================= */
  function activar(i){
    if(i===activa)return;if(!listo)preparar();
    if(activa>-1){var o=fichas[activa];o.classList.remove('es-activa');o.removeAttribute('aria-current');hilos[activa].f.classList.remove('es-activa');hilos[activa].p.classList.remove('es-activa');
      var ob=o.querySelector('.pl-ficha__cuerpo');ob.style.removeProperty('--rx');ob.style.removeProperty('--ry')}
    activa=i;escena.classList.toggle('hay-activa',i>-1);
    if(i>-1){fichas[i].classList.add('es-activa');hilos[i].f.classList.add('es-activa');hilos[i].p.classList.add('es-activa');escena.style.setProperty('--tono',hilos[i].color)}
    velObj=i>-1?0:0.085;if(!corriendo)pintar(reloj);
  }
  function inclinar(i,e){
    var f=fichas[i],b=f.getBoundingClientRect(),dx=(e.clientX-(b.left+b.width/2))/(b.width/2),dy=(e.clientY-(b.top+b.height/2))/(b.height/2);
    dx=Math.max(-1,Math.min(1,dx));dy=Math.max(-1,Math.min(1,dy));
    var c=f.querySelector('.pl-ficha__cuerpo');c.style.setProperty('--ry',(dx*22).toFixed(1)+'deg');c.style.setProperty('--rx',(-dy*22).toFixed(1)+'deg');
    c.style.setProperty('--gx',(50+dx*30).toFixed(0)+'%');c.style.setProperty('--gy',(40+dy*30).toFixed(0)+'%');
  }
  fichas.forEach(function(f,i){
    f.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){activar(i);cursor(1,getComputedStyle(f).getPropertyValue('--marca').trim())}});
    f.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')cursor(0)});
    f.addEventListener('pointermove',function(e){if(e.pointerType==='mouse'){activar(i);inclinar(i,e)}});
    f.addEventListener('click',function(){activar(activa===i&&!fino&&performance.now()-f._foco>400?-1:i)});    /* táctil: un toque = hover; otro toque lo apaga */
    f._foco=0;f.addEventListener('focus',function(){f._foco=performance.now();activar(i)});
    f.addEventListener('blur',function(){if(activa===i)activar(-1)});
  });
  escena.addEventListener('pointermove',function(e){
    if(!fino||ligero)return;var b=escena.getBoundingClientRect();tx=((e.clientX-b.left)/b.width-0.5)*2;ty=((e.clientY-b.top)/b.height-0.5)*2;
  });
  escena.addEventListener('pointerleave',function(e){tx=ty=0;cursor(0);if(e.pointerType==='mouse')activar(-1)});
  document.addEventListener('pointerdown',function(e){if(activa>-1&&!escena.contains(e.target))activar(-1)},{passive:true});

  /* ======================= arranque perezoso y pausa fuera de pantalla ======================= */
  var listo=false,visible=false;
  function preparar(){
    if(listo)return;listo=true;crearHilos();medir();
    if('ResizeObserver' in window)new ResizeObserver(function(){medir()}).observe(escena);else addEventListener('resize',medir);
  }
  new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)cargarCuadros()})},{rootMargin:'100% 0px'}).observe(escena);
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      visible=e.isIntersecting;
      if(e.isIntersecting){preparar();sec.classList.add('plt--vista');arrancar()}else parar();
    });
  },{rootMargin:'150px 0px'}).observe(escena);
  if(marquee)new IntersectionObserver(function(es){es.forEach(function(e){marquee.classList.toggle('esta-fuera',!e.isIntersecting)})}).observe(marquee);
  document.addEventListener('visibilitychange',function(){document.hidden?parar():(visible&&arrancar())});
  if(quieto)sec.classList.add("plt--vista");
})();
