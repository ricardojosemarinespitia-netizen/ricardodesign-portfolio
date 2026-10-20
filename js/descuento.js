/* descuento.js — inscripción con 10 % de descuento (cierre del home).
   Sin dependencias, sin red, sin almacenamiento: valida y reenvía nombre y correo al WhatsApp del estudio. */
(function(){
  var s=document.getElementById('descuento');if(!s)return;
  var tg=s.querySelector('.desc__tg'),cuerpo=s.querySelector('.desc__cuerpo'),f=s.querySelector('form'),
      ok=s.querySelector('.desc__listo'),enl=s.querySelector('.desc__wa'),go=s.querySelector('.desc__go'),
      mq=matchMedia('(min-width:901px)'),WA='https://wa.me/573227403983?text=';

  /* Móvil: plegada; escritorio: siempre abierta. El estado inicial lo fija CSS (html.js), aquí solo la semántica. */
  var u=false;
  function abrir(v){s.classList.toggle('abierta',v);tg.setAttribute('aria-expanded',v)}
  function modo(){
    if(mq.matches){tg.disabled=true;abrir(true)}
    else{tg.disabled=false;abrir(u)}
  }
  tg.addEventListener('click',function(){if(!mq.matches){u=!u;abrir(u)}});
  function irA(){if(location.hash==='#descuento'&&!mq.matches){u=true;abrir(true)}}
  addEventListener('hashchange',irA);
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="#descuento"]');if(a&&!mq.matches){u=true;abrir(true)}});
  (mq.addEventListener?mq.addEventListener('change',modo):mq.addListener(modo));
  modo();irA();

  var n=f.elements.nombre,c=f.elements.correo,k=f.elements.acepto,b=f.elements.web;
  var RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function err(el,msg){
    var e=document.getElementById(el.getAttribute('data-e'));
    e.textContent=msg||'';
    if(msg){el.setAttribute('aria-invalid','true')}else{el.removeAttribute('aria-invalid')}
    return !msg;
  }
  function vNombre(){var v=n.value.replace(/\s+/g,' ').trim();return err(n,v.length<2?'Escribe tu nombre.':'')}
  function vCorreo(){var v=c.value.trim();return err(c,!v?'Escribe tu correo.':(RE.test(v)?'':'Revisa tu correo: debe verse como nombre@dominio.com.'))}
  function vAcepto(){return err(k,k.checked?'':'Marca la casilla para aceptar el tratamiento de tus datos.')}
  n.addEventListener('blur',function(){if(n.value)vNombre()});
  c.addEventListener('blur',function(){if(c.value)vCorreo()});
  [n,c,k].forEach(function(el){el.addEventListener('input',function(){if(el.getAttribute('aria-invalid'))(el===n?vNombre:el===c?vCorreo:vAcepto)()});});
  k.addEventListener('change',function(){if(k.getAttribute('aria-invalid'))vAcepto()});

  f.addEventListener('submit',function(ev){
    ev.preventDefault();
    var a=vNombre(),d=vCorreo(),e=vAcepto();
    if(!(a&&d&&e)){(!a?n:!d?c:k).focus();return}
    if(b&&b.value)return;                       /* honeypot lleno: es un bot, no se envía nada */
    var nom=n.value.replace(/[\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,80),
        cor=c.value.trim().slice(0,120),
        msg='Hola Ricardo, quiero mi 10 % de descuento. Nombre: '+nom+' Correo: '+cor,
        url=WA+encodeURIComponent(msg);
    go.disabled=true;go.setAttribute('aria-busy','true');go.querySelector('.desc__gt').textContent='Abriendo WhatsApp…';
    enl.href=url;
    f.hidden=true;ok.hidden=false;ok.focus();
    enl.click();                               /* mismo gesto del usuario: el <a> real abre WhatsApp, también en el navegador de Instagram/Facebook */
  });
})();

/* ===== Botón flotante del descuento ("Inscríbete: 10 % de descuento") =====
   Se crea aquí (etapa 2 de la carga, tras el primer pintado). Aparece a los ~6 s o al bajar más de un pliegue; se oculta sobre #contacto
   (donde está la tarjeta) y con el menú abierto; la × lo quita toda la sesión (sessionStorage con try/catch). Enlaza a #descuento. */
(function(){
  var K='rd_dflo_x';
  try{if(sessionStorage.getItem(K))return}catch(e){}
  var meta=document.getElementById('contacto'),tarj=document.getElementById('descuento');
  if(!meta||!tarj||!document.body)return;
  var d=document,w=d.createElement('div');
  w.className='dflo';
  w.innerHTML='<div class="dflo__in"><a class="dflo__a" href="#descuento" aria-label="Inscríbete y obtén 10 % de descuento. Ir al formulario"><span>Inscríbete:</span><b>10&nbsp;% de descuento</b></a>'+
    '<button type="button" class="dflo__x" aria-label="Cerrar aviso de descuento"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
  d.body.appendChild(w);
  var listo=false,pasado=false,enMeta=false,menu=false,cerrado=false;
  /* 'pasado': no sale sobre el primer pliegue (ahí están los controles del carrusel del hero) */
  function pintar(){var v=listo&&pasado&&!enMeta&&!menu&&!cerrado;w.classList.toggle('dflo--ver',v);d.documentElement.classList.toggle('dflo-on',v)}  /* dflo-on: en móvil el botón de WhatsApp se apila encima */
  setTimeout(function(){listo=true;pintar()},6000);
  function medir(){var p=scrollY>innerHeight*.3;if(!listo&&scrollY>innerHeight*1.1)listo=true;if(p!==pasado||listo)pasado=p;pintar()}
  addEventListener('scroll',medir,{passive:true});medir();
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){enMeta=es[es.length-1].isIntersecting;pintar()},{threshold:0}).observe(meta);
  }
  var panel=d.getElementById('panel'),bm=d.querySelector('.nav__menu');
  function leerMenu(){menu=!!(panel&&panel.classList.contains('abierto'))||!!(bm&&bm.getAttribute('aria-expanded')==='true');pintar()}
  if(panel&&window.MutationObserver){new MutationObserver(leerMenu).observe(panel,{attributes:true,attributeFilter:['class']});leerMenu()}
  w.querySelector('.dflo__x').addEventListener('click',function(){
    cerrado=true;pintar();
    try{sessionStorage.setItem(K,'1')}catch(e){}
    setTimeout(function(){if(w.parentNode)w.parentNode.removeChild(w)},700);
  });
})();

/* ===== Botón flotante de WhatsApp (.wflo; el <a> ya está en index.html con data-wa, oculto con [hidden]) =====
   Aparece a los ~3 s o al primer scroll. Se oculta con el menú abierto, sobre #contacto (que ya trae su CTA y la tarjeta), cuando un control ajeno (WhatsApp, carruseles) o el pie
   pasan por su esquina (132 px) o su franja (120 px), y sobre los planes (CSS, html.planes-vista). Posición: css/descuento.css. */
(function(){
  var w=document.querySelector('.wflo');if(!w)return;
  var d=document,t=false,sc=false,cierre=false,pie=false,menu=false,ya=false,cta=0;
  function pintar(){
    var v=(t||sc)&&!cierre&&!pie&&!menu&&!cta;
    if(v&&!ya){ya=true;w.hidden=false;void w.offsetWidth}
    w.classList.toggle('wflo--ver',v);
  }
  setTimeout(function(){t=true;pintar()},Math.max(0,3000-(window.performance?performance.now():0)));
  function medir(){if(!sc&&scrollY>40){sc=true;pintar()}}
  addEventListener('scroll',medir,{passive:true});medir();
  if('IntersectionObserver' in window){
    var c=d.getElementById('contacto'),p=d.querySelector('.pie');
    if(c)new IntersectionObserver(function(es){cierre=es[es.length-1].isIntersecting;pintar()},{threshold:0}).observe(c);
    if(p)new IntersectionObserver(function(es){pie=es[es.length-1].isIntersecting;pintar()},{threshold:0,rootMargin:'0px 0px -120px 0px'}).observe(p);
    /* control ajeno (botones de WhatsApp, controles del carrusel del hero y de casos) que pasa por la esquina del flotante (132 × 120 px): el flotante sobra o estorba, se aparta */
    var ctas=d.querySelectorAll('[data-wa]:not(.wflo),.hv-ficha button,.casos__btn'),io;
    function armar(){
      if(io)io.disconnect();cta=0;
      io=new IntersectionObserver(function(es){es.forEach(function(e){cta+=e.isIntersecting?(e.target.__wf?0:1):(e.target.__wf?-1:0);e.target.__wf=e.isIntersecting});pintar()},{threshold:0,rootMargin:'-'+Math.max(0,innerHeight-132)+'px 0px 0px -'+Math.max(0,innerWidth-120)+'px'});
      [].forEach.call(ctas,function(e){e.__wf=false;io.observe(e)});
    }
    if(ctas.length){armar();var rz;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(armar,250)})}
  }
  var panel=d.getElementById('panel'),bm=d.querySelector('.nav__menu');
  function leerMenu(){menu=!!(panel&&panel.classList.contains('abierto'))||!!(bm&&bm.getAttribute('aria-expanded')==='true');pintar()}
  if(panel&&window.MutationObserver){new MutationObserver(leerMenu).observe(panel,{attributes:true,attributeFilter:['class']});leerMenu()}
})();
