/* Pauta 3D: el video corre solo a la vista y con la pestaña visible; sin movimiento / ahorro de datos / WebView queda el póster. Sin rAF propio. */
!function(){
  var F=document.querySelector('.plt-pauta'),v=F&&F.querySelector('video');if(!v)return;
  var H=document.documentElement,c=navigator.connection,dm=navigator.deviceMemory,vis=false;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||H.classList.contains('quieto')||H.classList.contains('webview')||/[?&]estatico/.test(location.search)||(c&&c.saveData)||(H.classList.contains('ligero')&&dm&&dm<=2)||!('IntersectionObserver' in window)){v.remove();return}
  function sonar(){if(vis&&!document.hidden){var r=v.play();r&&r.catch&&r.catch(function(){})}else if(!v.paused)v.pause()}
  v.addEventListener('playing',function(){v.classList.add('vivo')});
  v.addEventListener('error',function(){v.remove()},true);
  new IntersectionObserver(function(e){vis=e[0].isIntersecting;sonar()},{threshold:.25}).observe(F);
  document.addEventListener('visibilitychange',sonar);
}();
