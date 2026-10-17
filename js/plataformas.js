/* Plataformas y marcas · v4 "ecosistema en colisión" · 2026-10-17
   Sobre la escena v3.1 (rd en cromo girable + medallas Blender) se monta un motor de física propio, sin librerías:
   cada medalla es un cuerpo con resorte hacia su lugar en una figura (órbita, espiral, constelación, rejilla) que cambia
   con el scroll (scrub) o al tocar el rd; choca con las demás y con el rd, rebota en los bordes, sale disparada si el
   puntero o el dedo pasan rápido, se voltea en 3D (16 cuadros Blender Cycles de media vuelta por medalla, hoja bajo
   demanda) y vuelve a su lugar con elasticidad. Tocar el rd = estallido (esquirlas de cromo Blender + pulso + destello).
   Mantener presionado el fondo = imán. Inclinar el celular mueve todo: Android sin pedir nada; iOS pide el permiso del
   sistema dentro del primer toque sobre la sección (lo exige Safari) y mientras tanto el dedo hace de inclinación.
   Sacudir = estallido. Un solo reloj (gsap.ticker si existe), nada corre fuera de pantalla, solo transform/opacity.
   Calidad adaptable: si baja de 45 fps se quitan desenfoque, choques entre medallas y luego los hilos.
   Modos livianos (WebView de Instagram/Facebook, ahorro de datos): escena v3.1 sin bucle. ?estatico y reducido: quieta. */
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
  var wv=root.classList.contains('webview')||/Instagram|FBAN|FBAV/.test(navigator.userAgent);
  var liviano=quieto||wv||!!con.saveData;
  var fis=!liviano;                                              /* motor de física activo */
  var ligero=liviano||!fino||!matchMedia('(min-width:901px)').matches;   /* rd por hoja de 24 cuadros (sin Canvas) */
  if(ligero)escena.classList.add('es-ligero');
  if(fis)escena.classList.add('es-fisica');
  var TAU=Math.PI*2,NS='http://www.w3.org/2000/svg';

  /* ---- hilos ---- */
  function trazo(g,cl){var p=document.createElementNS(NS,'path');p.setAttribute('class',cl);p.setAttribute('pathLength','100');g.appendChild(p);return p}
  var hilos=[];
  function crearHilos(){
    hilos=fichas.map(function(f){
      var h={a:trazo(gAtras,'pl-hilo'),f:trazo(gFrente,'pl-hilo'),c:ligero?null:trazo(gFrente,'pl-chispas'),p:trazo(gFrente,'pl-pulso')};
      var c=getComputedStyle(f).getPropertyValue('--marca').trim();h.p.style.setProperty('--c',c);h.f.style.setProperty('--c',c);h.color=c;return h;
    });
  }

  /* ---- medidas ---- */
  var W=0,H=0,cx=0,cy=0,rx=0,ry=0,S=0,FI=60,EF=1;
  function medir(){
    W=escena.clientWidth;H=escena.clientHeight;S=rd.clientWidth;FI=fichas[0].offsetWidth||60;
    cx=W*0.5;cy=rd.offsetTop+S*0.54;rx=W*0.43;ry=W*0.17;EF=W<560?0.8:1;if(fis&&W<560){rx=W*0.44;ry=W*0.22}
    if(orbe){orbe.setAttribute('cx',cx.toFixed(1));orbe.setAttribute('cy',cy.toFixed(1));orbe.setAttribute('rx',rx.toFixed(1));orbe.setAttribute('ry',ry.toFixed(1))}
    if(!fis)pintar(reloj);
  }

  /* ---- estado ---- */
  var reloj=0,giro=-0.4,vel=0.085,velObj=0.085,entrada=ligero?1:0,activa=-1;
  var px=0,py=0,tx=0,ty=0,prog=0;
  function ease(x){x=x<0?0:x>1?1:x;return 1-Math.pow(1-x,3)}
  function cl(v,a,b){return v<a?a:v>b?b:v}

  /* escena estática (v3.1): ?estatico, reducido, WebView y ahorro de datos */
  function pintar(t){
    if(!W||!hilos.length)return;
    var inc=px*0.07,ci=Math.cos(inc),si=Math.sin(inc);
    var ryy=ry*(1+py*0.18+prog*0.35);
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
      lado(f,X+cx);profundo(f,s>-0.12);
      hilo(i,cx+X,cy+Y+sy,c,s,Math.max(0,Math.min(1,e*1.6-0.6)),s>-0.12,sy);
    }
    if(fondo){fondo.style.setProperty('--fx',(px*-6).toFixed(1)+'px');fondo.style.setProperty('--fy',(py*-5+sy*0.3).toFixed(1)+'px')}
    var resp=ligero?0:Math.sin(t*1.3)*0.012;
    rd.style.transform='translate3d('+(px*-10).toFixed(1)+'px,'+(sy*0.6+py*-6+(ligero?0:Math.sin(t*0.7)*3)).toFixed(1)+'px,0) scale('+(1+resp).toFixed(4)+')';
  }
  function lado(f,xx){var l=xx>W*0.8?2:xx<W*0.2?1:0;if(f._l!==l){f.classList.toggle('lbl-der',l===2);f.classList.toggle('lbl-izq',l===1);f._l=l}}
  function profundo(f,del){var z=del?5:1;if(f._z!==z){f.style.zIndex=z;f._z=z;f.classList.toggle('es-fondo',!del)}}
  /* hilo del borde del rd (dirección c,s) a la medalla (x1,y1), con comba */
  function hilo(i,x1,y1,c,s,vis,del,sy){
    var x0=cx+c*S*0.26+px*-W*0.012,y0=cy+s*S*0.12+sy*0.6-S*0.05;
    var qx=(x0+x1)/2,qy=(y0+y1)/2+W*0.035;
    var dd='M'+x1.toFixed(1)+' '+y1.toFixed(1)+'Q'+qx.toFixed(1)+' '+qy.toFixed(1)+' '+x0.toFixed(1)+' '+y0.toFixed(1);
    var h=hilos[i],act=i===activa;
    if(h._d!==dd){h.a.setAttribute('d',dd);h.f.setAttribute('d',dd);h.p.setAttribute('d',dd);if(h.c)h.c.setAttribute('d',dd);h._d=dd}
    var oa=del?0:vis*0.45,of=del||act?(act?1:vis*0.55):0,oc=h.c?(del?vis*(activa>-1&&!act?0.15:0.6):0):0;
    if(h._oa!==oa){h.a.style.opacity=oa.toFixed(3);h._oa=oa}
    if(h._of!==of){h.f.style.opacity=of.toFixed(3);h._of=of}
    if(h.c&&h._oc!==oc){h.c.style.opacity=oc.toFixed(3);h._oc=oc}
    if(h._v!==vis){h.f.style.strokeDashoffset=h.a.style.strokeDashoffset=((1-vis)*100).toFixed(1);h.f.style.strokeDasharray=h.a.style.strokeDasharray='100';h._v=vis}
  }

  /* ======================= motor de física ======================= */
  var B=[],forma=0,formaManual=-1,progManual=0,golpeRd=0,empujeRd={x:0,y:0,vx:0,vy:0},iman=null,ptr={x:0,y:0,vx:0,vy:0,t:0,dentro:false};
  var grav={x:0,y:0},gravDedo={x:0,y:0},q=2,fpsM=60,lentoT=0,scrollY0=0,scrollV=0,proxRafaga=3;
  var NOMBRES=['órbita','espiral','constelación','rejilla'];
  var CONST=[[-.36,-.30],[-.12,-.40],[.18,-.36],[.40,-.22],[.44,.10],[.30,.36],[.02,.42],[-.26,.38],[-.44,.14],[-.40,-.08]];
  function objetivo(k,i,t){   /* posición relativa al centro del rd y profundidad z (-1 atrás, 1 adelante) */
    var a,r;
    if(k===0){a=giro+TAU*i/n;return [Math.cos(a)*rx,Math.sin(a)*ry*(1+prog*0.35),Math.sin(a)]}
    if(k===1){r=(0.2+0.26*i/(n-1))*W;a=i*2.42+giro*1.6;return [Math.cos(a)*r,Math.sin(a)*r*0.6,0.3+0.7*Math.sin(a)]}
    if(k===2){var p=CONST[i];return [p[0]*W+Math.sin(t*0.6+i)*W*0.012,p[1]*H+Math.cos(t*0.5+i*1.3)*H*0.012-(cy-H*0.5),0.6]}
    var col=i%5,fil=i/5|0;return [(col-2)*W*0.19,(fil?0.4:-0.4)*H-(cy-H*0.5),1];
  }
  function crearCuerpos(){
    B=fichas.map(function(f,i){var a=TAU*i/n;return {x:0,y:0,vx:Math.cos(a)*900,vy:Math.sin(a)*600,z:1,fa:0,fv:900+Math.random()*900,vf:-1,e:0}});
  }
  function patear(b,fx,fy,giroF){b.vx+=fx;b.vy+=fy;b.fv+=giroF}
  function estallar(fuerza){
    fuerza=fuerza||1;golpeRd=1;
    B.forEach(function(b){var dx=b.x,dy=b.y,d=Math.hypot(dx,dy)||1,v=(1100+Math.random()*700)*fuerza;
      patear(b,dx/d*v,dy/d*v-200,(Math.random()<.5?-1:1)*(1200+Math.random()*1200))});
    esquirlas();
  }
  function cambiarForma(){formaManual=((formaManual<0?forma:formaManual)+1)%4;progManual=prog;
    B.forEach(function(b,i){b.fv+=(i%2?-1:1)*(700+i*60)});anunciar(NOMBRES[formaManual])}
  var voz=null;function anunciar(t){if(!voz){voz=document.createElement('span');voz.className='visually-hidden pl-voz';voz.setAttribute('aria-live','polite');escena.appendChild(voz)}voz.textContent='Figura: '+t}

  function fisica(t,dt){
    if(!W)return;
    /* figura según el scroll: entra en espiral, al centro órbita, sale en rejilla; el toque al rd la cambia */
    if(formaManual>-1&&Math.abs(prog-progManual)>0.45)formaManual=-1;
    var s=(1-prog)/2,ka,kb,mz;
    if(formaManual>-1){ka=kb=formaManual;mz=0}
    else if(s<0.32){ka=1;kb=0;mz=ease(s/0.32)}else if(s<0.62){ka=kb=0;mz=0}else{ka=0;kb=3;mz=ease((s-0.62)/0.3)}
    forma=mz>0.5?kb:ka;
    var gx=cl(grav.x+gravDedo.x,-1.4,1.4),gy=cl(grav.y+gravDedo.y,-1.4,1.4);
    gravDedo.x*=Math.pow(0.15,dt);gravDedo.y*=Math.pow(0.15,dt);
    var K=34,C=5.2,rr=FI*0.5*EF,Rrd=S*0.3,rcy=cy-S*0.04-cy;
    for(var i=0;i<n;i++){
      var b=B[i],A=objetivo(ka,i,t),Bq=ka===kb?A:objetivo(kb,i,t);
      var Tx=A[0]+(Bq[0]-A[0])*mz,Ty=A[1]+(Bq[1]-A[1])*mz,Tz=A[2]+(Bq[2]-A[2])*mz;
      if(i===activa){K=60;C=10}else{K=34;C=5.2}
      var ax=(Tx-b.x)*K-b.vx*C+gx*1500,ay=(Ty-b.y)*K-b.vy*C+gy*1500-scrollV*14;
      if(iman){var mx=iman.x-cx-b.x,my=iman.y-cy-b.y,md=Math.hypot(mx,my)||1;ax+=mx/md*Math.min(5200,md*30);ay+=my/md*Math.min(5200,md*30);ax-=b.vx*3;ay-=b.vy*3}
      b.vx+=ax*dt;b.vy+=ay*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=(Tz-b.z)*Math.min(1,dt*6);
      /* puntero rápido = patada */
      if(ptr.dentro&&!iman){var px2=b.x+cx-ptr.x,py2=b.y+cy-ptr.y,pd=Math.hypot(px2,py2),pv=Math.hypot(ptr.vx,ptr.vy);
        if(pd<FI*1.1&&pv>700&&i!==activa){var f=Math.min(2600,pv)*0.9;patear(b,(px2/(pd||1))*f*0.6+ptr.vx*0.5,(py2/(pd||1))*f*0.6+ptr.vy*0.5,(ptr.vx>0?1:-1)*Math.min(2400,pv*1.3))}}
      /* bordes */
      var lx=W*0.5-rr*0.8,ly1=-cy+rr*0.8,ly2=H-cy-rr*0.8;
      if(b.x<-lx){b.x=-lx;b.vx=Math.abs(b.vx)*0.6}else if(b.x>lx){b.x=lx;b.vx=-Math.abs(b.vx)*0.6}
      if(b.y<ly1){b.y=ly1;b.vy=Math.abs(b.vy)*0.6}else if(b.y>ly2){b.y=ly2;b.vy=-Math.abs(b.vy)*0.6}
      /* choque con el rd (solo las de adelante) */
      if(b.z>-0.15){var dx=b.x,dy=b.y-rcy,d=Math.hypot(dx,dy),mn=Rrd+rr*0.8;
        if(d<mn&&d>0.01){var nx=dx/d,ny=dy/d,vn=b.vx*nx+b.vy*ny;b.x=nx*mn;b.y=rcy+ny*mn;
          if(vn<0){b.vx-=1.75*vn*nx;b.vy-=1.75*vn*ny;b.fv+=vn*-1.2*(nx>0?1:-1);if(-vn>260){golpeRd=Math.min(1,golpeRd+(-vn)/1800);empujeRd.vx-=nx*-vn*0.06;empujeRd.vy-=ny*-vn*0.06}}}}
      /* volteo: resorte a la cara más cercana */
      b.fa+=b.fv*dt;b.fv*=Math.pow(0.35,dt);
      if(Math.abs(b.fv)<260){var o=Math.round(b.fa/180)*180;b.fv+=(o-b.fa)*55*dt*8;b.fv*=Math.pow(0.02,dt)}
      if(i===activa){var o2=Math.round(b.fa/180)*180;b.fa+=(o2-b.fa)*Math.min(1,dt*14);b.fv*=0.5}
    }
    /* choques entre medallas */
    if(q>1)for(i=0;i<n;i++)for(var j=i+1;j<n;j++){
      var p=B[i],r=B[j];if(Math.abs(p.z-r.z)>0.6)continue;
      var ex=r.x-p.x,ey=r.y-p.y,ed=Math.hypot(ex,ey),mn2=rr*1.7*(0.8+0.1*(p.z+r.z));
      if(ed<mn2&&ed>0.01){var ux=ex/ed,uy=ey/ed,ov=(mn2-ed)/2;p.x-=ux*ov;p.y-=uy*ov;r.x+=ux*ov;r.y+=uy*ov;
        var rel=(r.vx-p.vx)*ux+(r.vy-p.vy)*uy;if(rel<0){var im=-rel*0.88;p.vx-=im*ux;p.vy-=im*uy;r.vx+=im*ux;r.vy+=im*uy;if(-rel>300){p.fv+=rel*0.9;r.fv-=rel*0.9}}}
    }
    /* ráfaga: cada pocos segundos una medalla se voltea sola */
    proxRafaga-=dt;if(proxRafaga<0&&activa<0){proxRafaga=2.2+Math.random()*2.8;var bb=B[(Math.random()*n)|0];bb.fv+=(Math.random()<.5?-1:1)*1500;bb.vy-=260}
    /* rd: empuje elástico y destello */
    empujeRd.vx+=(-empujeRd.x*90-empujeRd.vx*9)*dt;empujeRd.vy+=(-empujeRd.y*90-empujeRd.vy*9)*dt;empujeRd.x+=empujeRd.vx*dt;empujeRd.y+=empujeRd.vy*dt;
    golpeRd*=Math.pow(0.04,dt);
    escribir(t,gx,gy);
  }
  function escribir(t,gx,gy){
    var sy=prog*-26;
    for(var i=0;i<n;i++){
      var b=B[i],f=fichas[i],d=(b.z+1)/2,esc=(0.7+0.38*d)*EF,inc=cl(b.vx*0.012,-24,24);
      f.style.transform='translate3d('+(b.x+cx-W*0.5).toFixed(1)+'px,'+(b.y+cy-H*0.5).toFixed(1)+'px,0) rotate('+inc.toFixed(1)+'deg) scale('+esc.toFixed(3)+')';
      if(f._op!==1){f.style.opacity=1;f._op=1}
      lado(f,b.x+cx);profundo(f,b.z>-0.12);
      /* cuadro del volteo (16 = media vuelta) */
      var a=((b.fa%180)+180)%180,k=Math.round(a/11.25)%16;
      var vf=hayVolteo&&k!==0?k:-1;
      if(vf!==b.vf){if(vf<0)f.classList.remove('es-volteo');else{if(b.vf<0)f.classList.add('es-volteo');f.style.setProperty('--vf',vf)}b.vf=vf}
      if(q>0){var dl=Math.hypot(b.x,b.y)||1;hilo(i,b.x+cx,b.y+cy,b.x/dl,b.y/dl,1,b.z>-0.12,sy*0)}
    }
    if(fondo){fondo.style.setProperty('--fx',(gx*-14+px*-6).toFixed(1)+'px');fondo.style.setProperty('--fy',(gy*-12+py*-5).toFixed(1)+'px')}
    var resp=Math.sin(t*1.3)*0.012+golpeRd*0.09;
    rd.style.transform='translate3d('+(empujeRd.x+gx*-10+px*-10).toFixed(1)+'px,'+(empujeRd.y+gy*-8+py*-6+Math.sin(t*0.7)*3).toFixed(1)+'px,0) scale('+(1+resp).toFixed(4)+')';
    rd.style.setProperty('--golpe',golpeRd.toFixed(3));
    if(est){estT+=1;var ek=Math.floor((performance.now()-est)/42);if(ek>15){est=0;estallido.style.opacity=0}else if(ek!==estK){estK=ek;estallido.style.backgroundPosition=(ek%4)*100/3+'% '+(ek/4|0)*100/3+'%';estallido.style.opacity=1}}
  }

  /* hojas Blender bajo demanda: volteo de medallas (AVIF 191 KB / WebP 374 KB) y esquirlas (60 / 84 KB) */
  var hayVolteo=false,hayEsq=false,estallido=null,est=0,estK=-1,estT=0;
  function hoja(base,listo){var pic=document.createElement('picture'),so=document.createElement('source'),im=new Image();so.type='image/avif';so.srcset=base+'.avif';pic.appendChild(so);im.decoding='async';
    im.onload=function(){listo(im.currentSrc||im.src)};im.src=base+'.webp';pic.appendChild(im)}
  function pedirHojas(){
    if(pedirHojas.ya||!fis)return;pedirHojas.ya=1;var b='assets/_efectos/blender/plataformas_v4/';
    hoja(b+'volteo',function(u){escena.style.setProperty('--pl-hoja-v','url("'+u+'")');hayVolteo=true});
    estallido=document.createElement('span');estallido.className='pl-estallido';estallido.setAttribute('aria-hidden','true');rd.appendChild(estallido);
    hoja(b+'esquirlas',function(u){estallido.style.backgroundImage='url("'+u+'")';hayEsq=true});
  }
  function esquirlas(){if(hayEsq){est=performance.now();estK=-1}var o=escena.querySelector('.pl-onda');if(o){o.classList.remove('es-viva');void o.offsetWidth;o.classList.add('es-viva')}}

  /* ======================= rd vivo (Canvas 2D, escritorio) ======================= */
  var cuadros=[],cargados=0,N=+rd.getAttribute('data-n')||72,ctx=null,ang=0,angVel=0,arrastre=null,tinte=0,tinteC='',chispas=[];
  function cargarCuadros(){
    if(ligero||cuadros.length||!lienzo.getContext)return;
    var base=rd.getAttribute('data-giro');ctx=lienzo.getContext('2d');
    var orden=[];for(var k=0;k<N;k+=6)orden.push(k);for(k=0;k<N;k++)if(k%6)orden.push(k);
    for(var i=0;i<N;i++)cuadros.push(null);
    var cola=orden.slice(),vivos=0;
    function sigue(){while(vivos<6&&cola.length){(function(k){vivos++;var im=new Image();im.decoding='async';
      im.onload=function(){cuadros[k]=im;cargados++;if(k===0)rd.classList.add('es-vivo');vivos--;sigue()};
      im.onerror=function(){vivos--;sigue()};im.src=base+(k<10?'0':'')+k+'.webp'})(cola.shift())}}
    sigue();
    for(i=0;i<26;i++)chispas.push({a:Math.random()*TAU,r:0.25+Math.random()*0.25,v:0.15+Math.random()*0.35,f:Math.random(),z:Math.random()});
  }
  function cuadroMasCercano(k){
    if(cuadros[k])return cuadros[k];
    for(var d=1;d<N/2;d++){var a=cuadros[(k+d)%N]||cuadros[(k-d+N)%N];if(a)return a}
    return null;
  }
  function pintarRd(t,dt){
    if(!ctx)return;
    if(!arrastre){
      angVel*=Math.pow(0.04,dt);
      var obj=Math.round(ang/360)*360+px*28+Math.sin(t*0.45)*10+(entrada<1?(1-ease(entrada))*-200:0);
      if(Math.abs(angVel)<40)ang+=(obj-ang)*Math.min(1,dt*1.6);
      ang+=angVel*dt;
    }
    var k=((Math.round(ang/(360/N))%N)+N)%N;
    var w=lienzo.width,h=lienzo.height,im=cuadroMasCercano(k);if(!im)return;
    tinte+=((activa>-1?1:0)-tinte)*Math.min(1,dt*6);if(activa>-1)tinteC=hilos[activa].color;
    var barr=(t%7)/7;
    ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);ctx.drawImage(im,0,0,w,h);
    ctx.globalCompositeOperation='source-atop';
    var lx=w*(0.5+px*0.35),ly=h*(0.35+py*0.25),g=ctx.createRadialGradient(lx,ly,0,lx,ly,w*0.38);
    g.addColorStop(0,'rgba(255,255,255,'+(0.55+golpeRd*0.45).toFixed(2)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    if(barr<0.32){var bx=(barr/0.32)*w*1.8-w*0.4,lg=ctx.createLinearGradient(bx-w*0.12,0,bx+w*0.12,h*0.3);
      lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(0.5,'rgba(255,255,255,.7)');lg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,w,h)}
    if(golpeRd>0.02){ctx.globalAlpha=golpeRd*0.7;ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.globalAlpha=1}   /* destello al chocar */
    if(tinte>0.01&&tinteC){ctx.globalAlpha=tinte*0.6;var tg=ctx.createRadialGradient(w*0.5,h*0.55,0,w*0.5,h*0.55,w*0.55);
      tg.addColorStop(0,tinteC);tg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=tg;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1}
    ctx.globalCompositeOperation='source-over';
    if(q>0)for(var i=0;i<chispas.length;i++){var c=chispas[i];c.f+=dt*c.v*(0.25+golpeRd*2);if(c.f>1){c.f=0;c.a=Math.random()*TAU}
      var r=c.r*w*(1+golpeRd*0.6),xx=w*0.5+Math.cos(c.a+t*0.2)*r,yy=h*(0.78-c.f*0.6)+Math.sin(c.a)*r*0.25,al=Math.sin(c.f*Math.PI)*0.55;
      ctx.globalAlpha=al;ctx.fillStyle=tinte>0.3&&tinteC?tinteC:'#9A9A9A';ctx.beginPath();ctx.arc(xx,yy,1+c.z*1.6,0,TAU);ctx.fill()}
    ctx.globalAlpha=1;
    var canto=Math.abs(Math.sin(ang*Math.PI/180));rd.style.setProperty('--ax',(1-canto*0.55).toFixed(3));rd.style.setProperty('--ao',(0.75-canto*0.3).toFixed(3));
  }
  /* toque corto al rd = estallido + nueva figura (el arrastre lo sigue girando) */
  var toque=null;
  rd.addEventListener('pointerdown',function(e){toque={x:e.clientX,y:e.clientY,t:performance.now()};pedirPermiso()});
  rd.addEventListener('pointerup',function(e){if(!toque||!fis)return;var mov=Math.hypot(e.clientX-toque.x,e.clientY-toque.y);if(mov<8&&performance.now()-toque.t<350){estallar(1);cambiarForma();if(!corriendo)arrancar()}toque=null});
  rd.addEventListener('pointerdown',function(e){if(ligero)return;arrastre={x:e.clientX,a:ang,t:performance.now(),lx:e.clientX};rd.classList.add('es-arrastre');try{rd.setPointerCapture(e.pointerId)}catch(_){}});
  rd.addEventListener('pointermove',function(e){if(!arrastre)return;var now=performance.now(),dx=e.clientX-arrastre.lx,dtm=Math.max(8,now-arrastre.t);
    ang=arrastre.a+(e.clientX-arrastre.x)*0.9;angVel=angVel*0.6+(dx*0.9/(dtm/1000))*0.4;arrastre.lx=e.clientX;arrastre.t=now});
  function soltar(){if(!arrastre)return;arrastre=null;rd.classList.remove('es-arrastre')}
  rd.addEventListener('pointerup',soltar);rd.addEventListener('pointercancel',soltar);
  var ayudaRd=fis?'; Enter dispara las medallas y cambia la figura':'';
  if(!ligero){rd.tabIndex=0;rd.setAttribute('aria-label','Monograma rd de Ricardo Design en cromo; gíralo con las flechas o arrastrándolo'+ayudaRd);
    rd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){angVel+=(e.key==='ArrowLeft'?-1:1)*420;e.preventDefault()}})}
  if(fis)rd.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();estallar(1);cambiarForma()}});

  /* ======================= rd ligero (hoja de 24 cuadros) ======================= */
  var lPasoExt=null;
  if(ligero&&!quieto){
    var hojaRd=null,lAng=0,lVel=0,lArr=null,lRaf=0,lUlt=0,lK=-1,M=24;
    escena.classList.add('es-girable');
    var pedirHoja=function(){if(hojaRd)return;hojaRd=document.createElement('span');hojaRd.className='pl-rd__hoja';hojaRd.setAttribute('aria-hidden','true');
      var src=rd.getAttribute('data-hoja'),im=new Image();
      im.onload=function(){hojaRd.style.backgroundImage='url("'+im.currentSrc+'")';rd.appendChild(hojaRd);lK=-1;lPinta();rd.classList.add('es-hoja')};
      var pic=document.createElement('picture'),so=document.createElement('source');so.type='image/avif';so.srcset=src+'.avif';pic.appendChild(so);im.decoding='async';im.src=src+'.webp';pic.appendChild(im)};
    var lPinta=function(){
      if(rd.classList.contains('es-hoja')){var k=((Math.round(lAng/(360/M))%M)+M)%M;if(k!==lK){lK=k;hojaRd.style.backgroundPosition=(k%6)*20+'% '+((k/6|0)*100/3).toFixed(3)+'%'}rd.style.removeProperty('--pl-ry')}
      else rd.style.setProperty('--pl-ry',Math.max(-28,Math.min(28,lAng*0.25)).toFixed(1)+'deg');
    };
    var lAvanza=function(dt){
      if(!lArr){lVel*=Math.pow(0.05,dt);lAng+=lVel*dt;if(Math.abs(lVel)<60){var o=Math.round(lAng/360)*360;lAng+=(o-lAng)*Math.min(1,dt*3.2)}}
      lPinta();return lArr||Math.abs(lVel)>2||Math.abs(lAng-Math.round(lAng/360)*360)>0.5;
    };
    lPasoExt=function(dt){if(lAvanza(dt)===false&&!lArr){lAng=Math.round(lAng/360)*360}};
    var lPaso=function(ms){var dt=Math.min(0.05,(ms-lUlt)/1000||0.016);lUlt=ms;
      if(corriendo){lRaf=0;return}                 /* el reloj único ya lo mueve */
      if(lAvanza(dt))lRaf=requestAnimationFrame(lPaso);else{lRaf=0;lAng=Math.round(lAng/360)*360;lPinta()}};
    var lMover=function(){if(!lRaf&&!corriendo){lUlt=performance.now();lRaf=requestAnimationFrame(lPaso)}};
    rd.addEventListener('pointerdown',function(e){pedirHoja();lArr={x:e.clientX,a:lAng,lx:e.clientX,t:performance.now()};lVel=0;rd.classList.add('es-arrastre');escena.classList.add('ya-girado');lMover()});
    rd.addEventListener('pointermove',function(e){if(!lArr)return;var now=performance.now(),dtm=Math.max(8,now-lArr.t);
      lAng=lArr.a+(e.clientX-lArr.x)*1.1;lVel=lVel*0.5+((e.clientX-lArr.lx)*1.1/(dtm/1000))*0.5;lArr.lx=e.clientX;lArr.t=now});
    var lSoltar=function(){if(!lArr)return;lArr=null;rd.classList.remove('es-arrastre');lMover()};
    rd.addEventListener('pointerup',lSoltar);rd.addEventListener('pointercancel',lSoltar);
    rd.tabIndex=0;rd.setAttribute('aria-label','Monograma rd de Ricardo Design en cromo; gíralo con las flechas o deslizando el dedo'+ayudaRd);
    rd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){pedirHoja();lVel+=(e.key==='ArrowLeft'?-1:1)*520;lMover();e.preventDefault()}});
  }

  /* ======================= inclinación del celular ======================= */
  var b0=null,permisoPedido=false,ultSacudida=0,escuchando=false;
  function alOrientar(e){if(e.gamma==null)return;if(b0===null)b0=e.beta;
    grav.x+=(cl(e.gamma/28,-1,1)-grav.x)*0.3;grav.y+=(cl((e.beta-b0)/28,-1,1)-grav.y)*0.3;
    if(!corriendo&&visible)arrancar()}
  function alMover(e){var a=e.acceleration||{},m=Math.hypot(a.x||0,a.y||0,a.z||0),now=performance.now();
    if(m>17&&now-ultSacudida>1200&&visible){ultSacudida=now;estallar(1.2)}}
  function escuchar(){if(escuchando)return;escuchando=true;addEventListener('deviceorientation',alOrientar);addEventListener('devicemotion',alMover)}
  /* iOS 13+: el permiso solo se puede pedir dentro de un gesto; se pide en el primer toque sobre la sección, sin botón */
  function pedirPermiso(){
    if(!fis||permisoPedido||fino)return;permisoPedido=true;
    var DO=window.DeviceOrientationEvent,DM=window.DeviceMotionEvent;
    if(DO&&typeof DO.requestPermission==='function'){
      DO.requestPermission().then(function(r){if(r==='granted')escuchar()}).catch(function(){});
      if(DM&&typeof DM.requestPermission==='function')DM.requestPermission().catch(function(){});
    }
  }
  if(fis&&!fino&&window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission!=='function')escuchar();   /* Android y demás: sin pedir nada */
  if(fis&&!fino){escena.addEventListener('touchend',pedirPermiso,{passive:true});escena.addEventListener('click',pedirPermiso)}

  /* ======================= reloj único ======================= */
  var corriendo=false,usaGsap=false,ultimo=0,rafId=0,t0=0;
  function paso(ms){
    var dt=Math.min(0.05,(ms-ultimo)/1000||0.016);ultimo=ms;reloj+=dt;
    if(entrada<1){var ahora=performance.now();if(!t0)t0=ahora;entrada=Math.min(1,(ahora-t0)/2400)}
    vel+=(velObj-vel)*Math.min(1,dt*3);giro+=vel*dt;
    px+=(tx-px)*Math.min(1,dt*5);py+=(ty-py)*Math.min(1,dt*5);
    var r=sec.getBoundingClientRect(),vh=innerHeight;
    prog=Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/vh));
    var sY=scrollY;scrollV=scrollV*0.7+((sY-scrollY0)/Math.max(dt,0.008))*0.3*0.01;scrollY0=sY;scrollV=cl(scrollV,-40,40);
    ptr.vx*=Math.pow(0.02,dt);ptr.vy*=Math.pow(0.02,dt);
    /* calidad adaptable */
    fpsM=fpsM*0.95+(1/Math.max(dt,0.001))*0.05;
    if(fpsM<45){lentoT+=dt;if(lentoT>1.5&&q>0){q--;lentoT=0;sec.setAttribute('data-q',q);escena.classList.toggle('pl-q1',q<2);escena.classList.toggle('pl-q0',q<1)}}else lentoT=0;
    window.__plFps=fpsM;
    if(fis)fisica(reloj,dt);else pintar(reloj);
    pintarRd(reloj,dt);if(lPasoExt)lPasoExt(dt);
  }
  function tickGsap(time){paso(time*1000)}
  function tickRaf(ms){paso(ms);rafId=requestAnimationFrame(tickRaf)}
  function arrancar(){
    if(corriendo||!fis||document.hidden)return;corriendo=true;ultimo=performance.now();scrollY0=scrollY;
    usaGsap=!!(window.gsap&&gsap.ticker);
    if(usaGsap)gsap.ticker.add(tickGsap);else rafId=requestAnimationFrame(tickRaf);
  }
  function parar(){if(!corriendo)return;corriendo=false;if(usaGsap)gsap.ticker.remove(tickGsap);else cancelAnimationFrame(rafId)}

  /* ======================= cursor propio del sitio ======================= */
  var cur=document.querySelector('.cursor');
  function cursor(modo,color){if(!cur)return;cur.classList.toggle('pl-sobre',modo===1);cur.classList.toggle('pl-gira',modo===2);if(color)cur.style.setProperty('--pl-cursor',color)}
  if(cur){rd.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')cursor(2)});rd.addEventListener('pointerleave',function(){cursor(0)})}

  /* ======================= interacción de medallas ======================= */
  function activar(i){
    if(i===activa)return;if(!listo)preparar();
    if(activa>-1){var o=fichas[activa];o.classList.remove('es-activa');hilos[activa].f.classList.remove('es-activa');hilos[activa].p.classList.remove('es-activa');
      var ob=o.querySelector('.pl-ficha__cuerpo');ob.style.removeProperty('--rx');ob.style.removeProperty('--ry')}
    activa=i;escena.classList.toggle('hay-activa',i>-1);
    if(i>-1){fichas[i].classList.add('es-activa');hilos[i].f.classList.add('es-activa');hilos[i].p.classList.add('es-activa');escena.style.setProperty('--tono',hilos[i].color);
      if(fis){var on=escena.querySelector('.pl-onda');if(on){on.style.setProperty('--c',hilos[i].color);on.style.left=(B[i].x+cx)+'px';on.style.top=(B[i].y+cy)+'px';on.classList.remove('es-viva');void on.offsetWidth;on.classList.add('es-viva')}
        golpeRd=Math.max(golpeRd,0.35)}}
    velObj=i>-1?0:0.085;if(!corriendo&&!fis)pintar(reloj);
  }
  function inclinar(i,e){
    var f=fichas[i],b=f.getBoundingClientRect(),dx=(e.clientX-(b.left+b.width/2))/(b.width/2),dy=(e.clientY-(b.top+b.height/2))/(b.height/2);
    dx=cl(dx,-1,1);dy=cl(dy,-1,1);
    var c=f.querySelector('.pl-ficha__cuerpo');c.style.setProperty('--ry',(dx*22).toFixed(1)+'deg');c.style.setProperty('--rx',(-dy*22).toFixed(1)+'deg');
    c.style.setProperty('--gx',(50+dx*30).toFixed(0)+'%');c.style.setProperty('--gy',(40+dy*30).toFixed(0)+'%');
  }
  function lento(){return Math.hypot(ptr.vx,ptr.vy)<700}
  fichas.forEach(function(f,i){
    f.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'&&lento()){activar(i);cursor(1,getComputedStyle(f).getPropertyValue('--marca').trim())}});
    f.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')cursor(0)});
    f.addEventListener('pointermove',function(e){if(e.pointerType==='mouse'&&lento()){activar(i);inclinar(i,e)}});
    f.addEventListener('click',function(){var apaga=activa===i&&!fino&&performance.now()-f._foco>400;activar(apaga?-1:i);if(fis&&B[i]&&!apaga){B[i].fv+=1440;B[i].vy-=320}});
    f._foco=0;f.addEventListener('focus',function(){f._foco=performance.now();activar(i)});
    f.addEventListener('blur',function(){if(activa===i)activar(-1)});
  });
  escena.addEventListener('pointermove',function(e){
    var b=escena.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,now=performance.now(),dtm=Math.max(8,now-(ptr.t||now-16));
    if(ptr.dentro){ptr.vx=ptr.vx*0.4+((x-ptr.x)/(dtm/1000))*0.6;ptr.vy=ptr.vy*0.4+((y-ptr.y)/(dtm/1000))*0.6}
    if(iman){iman.x=x;iman.y=y}
    if(fis&&e.pointerType!=='mouse'&&!iman){gravDedo.x=cl(gravDedo.x+(x-ptr.x)/140,-1.2,1.2);gravDedo.y=cl(gravDedo.y+(y-ptr.y)/140,-1.2,1.2)}  /* el dedo hace de inclinación */
    ptr.x=x;ptr.y=y;ptr.t=now;ptr.dentro=true;
    if(fino&&!ligero){tx=(x/b.width-0.5)*2;ty=(y/b.height-0.5)*2}
  });
  escena.addEventListener('pointerdown',function(e){
    if(!fis||e.target.closest('.pl-ficha')||e.target.closest('.pl-rd'))return;
    var b=escena.getBoundingClientRect();iman={x:e.clientX-b.left,y:e.clientY-b.top};escena.classList.add('es-iman');if(!corriendo)arrancar()});
  function sueltaIman(){if(!iman)return;iman=null;escena.classList.remove('es-iman');B.forEach(function(b){b.fv+=(Math.random()<.5?-1:1)*900})}
  addEventListener('pointerup',sueltaIman);addEventListener('pointercancel',sueltaIman);
  escena.addEventListener('pointerleave',function(e){tx=ty=0;ptr.dentro=false;cursor(0);if(e.pointerType==='mouse')activar(-1)});
  document.addEventListener('pointerdown',function(e){if(activa>-1&&!escena.contains(e.target))activar(-1)},{passive:true});

  /* ======================= arranque perezoso y pausa fuera de pantalla ======================= */
  var listo=false,visible=false;
  function preparar(){
    if(listo)return;listo=true;crearHilos();
    if(fis){crearCuerpos();var on=document.createElement('span');on.className='pl-onda';on.setAttribute('aria-hidden','true');escena.appendChild(on)}
    medir();
    if('ResizeObserver' in window)new ResizeObserver(function(){medir()}).observe(escena);else addEventListener('resize',medir);
  }
  new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cargarCuadros();pedirHojas()}})},{rootMargin:'100% 0px'}).observe(escena);
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      visible=e.isIntersecting;
      if(e.isIntersecting){preparar();sec.classList.add('plt--vista');arrancar()}else parar();
    });
  },{rootMargin:'150px 0px'}).observe(escena);
  if(marquee)new IntersectionObserver(function(es){es.forEach(function(e){marquee.classList.toggle('esta-fuera',!e.isIntersecting)})}).observe(marquee);
  document.addEventListener('visibilitychange',function(){document.hidden?parar():(visible&&arrancar())});
  if(quieto)sec.classList.add('plt--vista');
  window.__pl={estallar:function(){estallar(1)},forma:cambiarForma,q:function(){return q}};
})();
