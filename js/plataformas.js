/* Plataformas y marcas · Agente C · 2026-10-17
   Escena v2: medallas de latón (Blender) en órbita inclinada alrededor del lacre en su medallón (Blender), atadas con hilos SVG.
   Reglas: un solo reloj (gsap.ticker si GSAP ya llegó; si no, un rAF propio que se apaga fuera de pantalla),
   solo transform/opacity en el DOM, nada corre hasta que la sección se acerca (IntersectionObserver),
   html.quieto (reducido o ?estatico) = una sola pintura en su estado final, sin bucle.
   Sin Canvas ni WebGL: solo transform/opacity en 11 nodos y 10 atributos d por cuadro. */
(function(){
  'use strict';
  var root=document.documentElement;
  var sec=document.getElementById('plataformas');if(!sec||!('IntersectionObserver' in window))return;
  var escena=sec.querySelector('.pl-escena'),sello=sec.querySelector('.pl-sello');
  var orbe=sec.querySelector('.pl-orbe'),gAtras=sec.querySelector('.pl-hilos--atras g'),gFrente=sec.querySelector('.pl-hilos--frente g');
  var fichas=[].slice.call(sec.querySelectorAll('.pl-ficha')),n=fichas.length;
  var marquee=sec.querySelector('.plt-marquee');
  var quieto=root.classList.contains('quieto');
  var fino=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var TAU=Math.PI*2,NS='http://www.w3.org/2000/svg';

  /* ---- hilos: dos trazos por medalla (uno detrás del medallón y otro delante); se ve el que corresponde ---- */
  var hilos=fichas.map(function(){
    var a=document.createElementNS(NS,'path'),f=document.createElementNS(NS,'path');
    gAtras.appendChild(a);gFrente.appendChild(f);return [a,f];
  });

  /* ---- medidas (px de la escena). Geometría medida en el render (alfa): centro del medallón en 47,3 % x 42 % de la imagen;
     semiejes de su borde: 42,9 % x 30 %. ---- */
  var W=0,H=0,cx=0,cy=0,rx=0,ry=0,mx=0,my=0;
  function medir(){
    W=escena.clientWidth;H=escena.clientHeight;
    var iw=W*0.54,ih=iw*618/960;
    cx=W*0.245+iw*0.473;cy=H*0.33+ih*0.42;mx=iw*0.429;my=ih*0.30;
    rx=W*0.41;ry=W*0.2;
    if(orbe){orbe.setAttribute('cx',cx.toFixed(1));orbe.setAttribute('cy',cy.toFixed(1));orbe.setAttribute('rx',rx.toFixed(1));orbe.setAttribute('ry',ry.toFixed(1))}
    pintar(reloj);
  }

  /* ---- estado ---- */
  var reloj=0,giro=-0.35,vel=0.09,velObj=0.09,entrada=quieto?1:0,activa=-1;
  var px=0,py=0,tx=0,ty=0,scrollY0=0;   /* puntero/giroscopio suavizado (-1..1) y desfase por scroll */
  function ease(x){x=x<0?0:x>1?1:x;return 1-Math.pow(1-x,3)}

  /* ---- órbita + hilos ---- */
  function pintar(t){
    if(!W)return;
    var inc=px*0.06,ci=Math.cos(inc),si=Math.sin(inc),ryy=ry*(1+py*0.12);
    var sy=scrollY0*0.35;
    for(var i=0;i<n;i++){
      var a=giro+TAU*i/n,c=Math.cos(a),s=Math.sin(a);
      var e=quieto?1:ease(entrada*1.8-0.35-i*0.06);
      var x=c*rx*e,y=s*ryy*e+Math.sin(t*1.1+i*1.7)*W*0.006;
      var X=x*ci-y*si,Y=x*si+y*ci;
      var d=(s+1)/2,esc=(0.72+0.34*d)*(0.5+0.5*e);
      var f=fichas[i];
      f.style.transform='translate3d('+X.toFixed(1)+'px,'+(Y+cy-H*0.5+sy).toFixed(1)+'px,0) scale('+esc.toFixed(3)+')';
      f.style.opacity=Math.min(1,e*1.4).toFixed(3);
      var del=s>-0.05,z=del?5:1;if(f._z!==z){f.style.zIndex=z;f._z=z}
      /* hilo: del borde del medallón (en la dirección de la medalla) a la medalla, con una leve comba hacia abajo */
      var x0=cx+c*mx*ci-s*my*si,y0=cy+c*mx*si+s*my*ci+sy*0.4,x1=cx+X,y1=cy+Y+sy;
      var qx=(x0+x1)/2,qy=(y0+y1)/2+W*0.03;
      var dd='M'+x0.toFixed(1)+' '+y0.toFixed(1)+'Q'+qx.toFixed(1)+' '+qy.toFixed(1)+' '+x1.toFixed(1)+' '+y1.toFixed(1);
      var h=hilos[i],vis=Math.max(0,Math.min(1,e*1.6-0.6));
      h[0].setAttribute('d',dd);h[1].setAttribute('d',dd);
      h[0].style.opacity=del?0:(vis*0.5).toFixed(3);h[1].style.opacity=del?(i===activa?1:vis*0.6).toFixed(3):0;
    }
    if(sello)sello.style.transform='translate3d('+(px*-8).toFixed(1)+'px,'+(sy*0.4+Math.sin(t*0.7)*2).toFixed(1)+'px,0)';
  }

  /* ---- reloj único ---- */
  var corriendo=false,usaGsap=false,ultimo=0,rafId=0,cuadro=0;
  function paso(ms){
    var dt=Math.min(0.05,(ms-ultimo)/1000||0.016);ultimo=ms;reloj+=dt;
    if(entrada<1)entrada=Math.min(1,entrada+dt/2.2);
    vel+=(velObj-vel)*Math.min(1,dt*4);giro+=vel*dt;
    px+=(tx-px)*Math.min(1,dt*5);py+=(ty-py)*Math.min(1,dt*5);
    var r=sec.getBoundingClientRect(),vh=innerHeight;   /* parallax de scroll: -1 (entrando) a 1 (saliendo) */
    scrollY0=((r.top+r.height/2)-vh/2)/(vh)*-40;
    cuadro++;
    var t=reloj;
    pintar(t);
  }
  function tickGsap(time){paso(time*1000)}
  function tickRaf(ms){paso(ms);rafId=requestAnimationFrame(tickRaf)}
  function arrancar(){
    if(corriendo||quieto||document.hidden)return;corriendo=true;ultimo=performance.now();
    usaGsap=!!(window.gsap&&gsap.ticker);
    if(usaGsap)gsap.ticker.add(tickGsap);else rafId=requestAnimationFrame(tickRaf);
  }
  function parar(){
    if(!corriendo)return;corriendo=false;
    if(usaGsap)gsap.ticker.remove(tickGsap);else cancelAnimationFrame(rafId);
  }

  /* ---- interacción: la ficha más cercana al puntero se enciende con su color y el giro frena ---- */
  function cercana(cx,cy){
    var mejor=-1,dm=1e9;
    for(var i=0;i<n;i++){var b=fichas[i].getBoundingClientRect(),dx=b.left+b.width/2-cx,dy=b.top+b.height/2-cy,dd=dx*dx+dy*dy;
      if(dd<dm&&dd<Math.pow(b.width*0.75,2)){dm=dd;mejor=i}}
    return mejor;
  }
  function activar(i){
    if(i===activa)return;
    if(activa>-1){fichas[activa].classList.remove('es-activa');hilos[activa][1].classList.remove('es-activa')}
    activa=i;if(i>-1){fichas[i].classList.add('es-activa');hilos[i][1].classList.add('es-activa')}
    velObj=i>-1?0:0.09;if(quieto)pintar(reloj);
  }
  escena.addEventListener('pointermove',function(e){
    var b=escena.getBoundingClientRect();
    if(fino&&!quieto){tx=((e.clientX-b.left)/b.width-0.5)*2;ty=((e.clientY-b.top)/b.height-0.5)*2}
    activar(cercana(e.clientX,e.clientY));
  });
  /* giroscopio: solo si el navegador lo entrega sin pedir permiso (Android); en iOS no se pide nada */
  if(!fino&&!quieto)addEventListener('deviceorientation',function(e){
    if(e.gamma==null)return;tx=Math.max(-1,Math.min(1,e.gamma/25));ty=Math.max(-1,Math.min(1,(e.beta-45)/30));
  },{passive:true});
  escena.addEventListener('pointerleave',function(){tx=ty=0;activar(-1)});
  escena.addEventListener('pointerdown',function(e){activar(cercana(e.clientX,e.clientY))});

  /* ---- arranque perezoso y pausa fuera de pantalla ---- */
  var listo=false,visible=false;
  function preparar(){
    if(listo)return;listo=true;medir();
    if('ResizeObserver' in window)new ResizeObserver(function(){medir()}).observe(escena);
    else addEventListener('resize',medir);
  }
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      visible=e.isIntersecting;
      if(e.isIntersecting){preparar();sec.classList.add('plt--vista');arrancar()}
      else parar();
    });
  },{rootMargin:'200px 0px'}).observe(escena);
  if(marquee)new IntersectionObserver(function(es){es.forEach(function(e){marquee.classList.toggle('esta-fuera',!e.isIntersecting)})}).observe(marquee);
  document.addEventListener('visibilitychange',function(){document.hidden?parar():(visible&&arrancar())});
  if(quieto)sec.classList.add('plt--vista');
})();
