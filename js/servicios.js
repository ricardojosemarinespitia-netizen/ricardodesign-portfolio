/* Servicios v3: escenario 3D. Una escena activa a la vez.
   - Escritorio (>=1024): avanza solo al terminar el filete (dura lo que dura el video); hover o foco fija la fila.
   - <1024: la fila que cruza el centro de la pantalla elige la escena (escenario pegado arriba).
   - Video: el src se pone solo cuando el escenario está a ~1 pantalla; reproduce solo si se ve; pausa fuera de vista.
   - Modos ligeros (reducido, ?estatico, WebView Meta, saveData, poca memoria en táctil): solo póster.
   - Escena sin publicar: data-listo="0" (marco gris + ícono). Para activarla: data-listo="1". */
(function(){
  var sec=document.getElementById('servicios');if(!sec)return;
  var grid=sec.querySelector('.sv-grid'),marco=sec.querySelector('.sv-marco');if(!grid||!marco)return;
  var R=document.documentElement,filas=[].slice.call(sec.querySelectorAll('.sv-fila')),
      escs=[].slice.call(sec.querySelectorAll('.sv-esc')),marcas=[].slice.call(sec.querySelectorAll('.sv-marcas i')),
      cuenta=sec.querySelector('.sv-cuenta b'),BASE='assets/web/servicios3d/';
  var c=navigator.connection,mem=navigator.deviceMemory,
      ligero=R.classList.contains('quieto')||R.classList.contains('webview')||/[?&]estatico/.test(location.search)||
             !!(c&&c.saveData)||(R.classList.contains('ligero')&&mem&&mem<=2)||!('IntersectionObserver' in window);
  var ancho=matchMedia('(min-width:1024px)'),act=0,cerca=false,visible=false,fijo=false;

  /* Pósters y videos: se montan solo para escenas publicadas */
  escs.forEach(function(f){
    if(f.getAttribute('data-listo')!=='1')return;
    var n=f.getAttribute('data-n'),pic=document.createElement('picture'),s=document.createElement('source'),i=document.createElement('img');
    s.type='image/avif';s.setAttribute('data-srcset',BASE+n+'-poster.avif');
    i.setAttribute('data-src',BASE+n+'-poster.webp');i.width=960;i.height=540;i.alt='';i.decoding='async';
    pic.appendChild(s);pic.appendChild(i);f.insertBefore(pic,f.firstChild);
    if(ligero)return;
    var v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';
    v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.tabIndex=-1;
    v.width=960;v.height=540;v.disablePictureInPicture=true;f._v=v;f.appendChild(v);
    v.addEventListener('playing',function(){v.classList.add('vivo')});
    v.addEventListener('loadedmetadata',function(){if(f===escs[act]&&v.duration>2)grid.style.setProperty('--sv-dur',v.duration.toFixed(2)+'s')});
  });
  function posters(){escs.forEach(function(f){var s=f.querySelector('source[data-srcset]'),i=f.querySelector('img[data-src]');
    if(s){s.srcset=s.getAttribute('data-srcset');s.removeAttribute('data-srcset')}
    if(i){i.src=i.getAttribute('data-src');i.removeAttribute('data-src')}})}
  function cargar(f){var v=f&&f._v;if(!v||v._ok)return;v._ok=1;
    [['webm','video/webm'],['mp4','video/mp4']].forEach(function(e){var s=document.createElement('source');s.src=BASE+f.getAttribute('data-n')+'.'+e[0];s.type=e[1];v.appendChild(s)});
    v.load()}
  function sync(){escs.forEach(function(f,k){var v=f._v;if(!v)return;
    if(k===act&&visible){cargar(f);var p=v.play();if(p&&p.catch)p.catch(function(){})}else if(!v.paused)v.pause()});
    grid.classList.toggle('sv-fuera',!visible)}

  function activar(k,desde){
    if(k===act&&desde!=='inicio')return;act=k;
    filas.forEach(function(f,j){f.classList.toggle('es-activa',j===k)});
    escs.forEach(function(f,j){f.classList.toggle('es-activa',j===k)});
    marcas.forEach(function(m,j){m.classList.toggle('es-activa',j===k)});
    if(cuenta)cuenta.textContent='0'+(k+1);
    var v=escs[k]._v;if(v){try{v.currentTime=0}catch(e){}if(v.duration>2)grid.style.setProperty('--sv-dur',v.duration.toFixed(2)+'s');else grid.style.removeProperty('--sv-dur')}
    var p=filas[k].querySelector('.sv-prog');if(p){p.style.animation='none';void p.offsetWidth;p.style.animation=''}
    sync();
    /* precarga la siguiente cuando la actual ya corre */
    if(v&&!ligero&&cerca){var sig=escs[(k+1)%escs.length];setTimeout(function(){if(act===k)cargar(sig)},2500)}
  }

  if(!ligero)grid.classList.add('sv-mov');
  function modo(){R.classList.toggle('sv-auto',!ligero&&ancho.matches)}modo();
  if(ancho.addEventListener)ancho.addEventListener('change',modo);

  /* Cerca (~1 pantalla): pósters + video de la escena activa */
  new IntersectionObserver(function(es){if(es[0].isIntersecting&&!cerca){cerca=true;posters();if(!ligero)cargar(escs[act])}},{rootMargin:'100% 0px'}).observe(sec);
  /* Visible: reproducir; fuera: pausar */
  new IntersectionObserver(function(es){visible=es[0].isIntersecting;sync()},{threshold:.25}).observe(marco);

  /* Escritorio: avance automático con el filete; hover/foco fija */
  filas.forEach(function(f,k){
    var p=f.querySelector('.sv-prog');
    if(p)p.addEventListener('animationend',function(){if(R.classList.contains('sv-auto')&&!fijo&&act===k)activar((k+1)%filas.length)});
    f.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'&&ancho.matches){fijo=true;grid.classList.add('sv-fijo');activar(k)}});
    f.addEventListener('focusin',function(){fijo=true;grid.classList.add('sv-fijo');activar(k)});
    f.addEventListener('click',function(e){if(!e.target.closest('a'))activar(k)});
  });
  grid.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){fijo=false;grid.classList.remove('sv-fijo')}});
  grid.addEventListener('focusout',function(e){if(!grid.contains(e.relatedTarget)){fijo=false;grid.classList.remove('sv-fijo')}});

  /* < 1024: la fila en la franja central manda */
  var io=new IntersectionObserver(function(es){if(ancho.matches)return;es.forEach(function(e){if(e.isIntersecting)activar(filas.indexOf(e.target))})},{rootMargin:'-55% 0px -40% 0px'});
  filas.forEach(function(f){io.observe(f)});

  activar(0,'inicio');
})();
