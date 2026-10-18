/* Plataformas y marcas · v5 "órbitas libres" · 2026-10-17
   Las medallas ya no van atadas al rd: no hay hilos ni elipses guía. Cada una es un satélite con su propia trayectoria 3D
   (elipse kepleriana inclinada con precesión, ocho/lemniscata, rosetón en espiral, Lissajous 3D) alrededor del rd y
   sobre todo de la "d", con distinto plano, radio, velocidad y fase. Pasan por delante y por detrás del rd (oclusión real
   por capas contra la silueta del rd), con perspectiva (escala, brillo y desenfoque por profundidad),
   sombra suave sobre el piso (sin estelas ni rastros) y giro propio en su eje (hoja Blender de volteo). El cuerpo = trayectoria + desviación con
   resorte: el puntero, los choques y el estallido lo sacan de su órbita y vuelve con elasticidad.
   Regímenes de órbita: libre, polar, ocho y enjambre; el scroll los mezcla y tocar el rd los cambia.
   Hover = la medalla se frena, se pone de cara y toma su color; clic/toque/foco = viaja al frente y queda brillando
   mientras las demás siguen orbitando. Mantener presionado = imán; barrido rápido = patada; inclinar el celular = paralaje.
   Un solo reloj (gsap.ticker si existe), nada corre fuera de pantalla, solo transform/opacity en el DOM.
   Calidad adaptable (45 fps): sin desenfoque, sin choques. Modos livianos (WebView de Instagram/Facebook,
   ahorro de datos, ?estatico, reducido): composición 3D quieta calculada una vez, sin bucle. */
(function(){
  'use strict';
  /* ======================= AFINACION: todo el "carácter" del movimiento vive aquí =======================
     v5.1 "sutil": ~45 % de la energía de v5, medallas casi siempre de cara, rebotes amortiguados. Sube o baja a gusto. */
  var ENERGIA={
    vel:0.65,          /* velocidad orbital (1 = v5; la energía cinética es vel^2) */
    regimen:1.1,       /* rapidez del cambio de régimen al hacer scroll (v5: 2.4; menos = más lento) */
    camara:2.6,        /* seguimiento del paralaje de cámara (v5: 4) */
    entradaMs:1200,    /* giro de entrada del rd (v5: 2400) */
    aparece:0.22,      /* fundido + escala de cada medalla al entrar la sección, en segundos (v5.1: 0,45 tras 4 s de cascada) */
    escalonado:0.015,  /* retraso entre medallas al aparecer, en segundos (máx. 60 ms): ya nacen repartidas en su órbita */
    patada:0.38,       /* patada del puntero rápido (1 = v5) */
    leanPuntero:18,    /* atracción de la medalla en hover hacia el puntero (v5: 40) */
    leanMax:0.07,      /* recorrido máximo de esa atracción (v5: 0.12) */
    iman:0.45,         /* fuerza del imán al mantener presionado (1 = v5) */
    estallido:0.5,     /* fuerza del estallido del rd (1 = v5) */
    choque:0.5,        /* impulso en choques entre medallas (v5: 0.9) */
    rebote:1.3,        /* rebote contra el rd: 1 = sin rebote, 2 = elástico total (v5: 1.7) */
    cabeceo:0.45       /* inclinación (roll) de la medalla al moverse (1 = v5) */
  };
  var AMORTIGUACION={
    resorte:8,         /* rigidez del resorte que devuelve la medalla a su órbita (v5: 14) */
    freno:5.2,         /* fricción de ese resorte; 2*raíz(resorte)=5.7 sería crítico (v5: 4.2, rebotaba) */
    rafaga:[5,5]       /* cada cuántos segundos una medalla recibe un empujoncito: [mínimo, rango] (v5: 2.5 + 3) */
  };
  var GIRO_PROPIO={
    amp:26,            /* grados de balanceo (yaw) alrededor de "de cara"; |ángulo| < 90 siempre = casi nunca de canto */
    periodo:15,        /* segundos de un balanceo completo (cada medalla lo varía) */
    rigidez:9,         /* qué tan rápido sigue su ángulo objetivo (resorte) */
    freno:5.4,         /* amortiguación de ese resorte (crítico = 2*raíz(rigidez)) */
    golpe:0.17,        /* cuánto del antiguo golpe de giro se conserva (1 = v5, que las volteaba) */
    vmax:240,          /* tope de velocidad angular (grados/s) por cualquier golpe */
    tope:46,           /* desviación máxima respecto al balanceo (grados) */
    volteo:1.5         /* velocidad del volteo completo al activar (1/seg, ~1,8 s); solo con clic/toque/foco */
  };
  var root=document.documentElement;
  var sec=document.getElementById('plataformas');if(!sec||!('IntersectionObserver' in window))return;
  var escena=sec.querySelector('.pl-escena'),rd=sec.querySelector('.pl-rd'),lienzo=sec.querySelector('.pl-rd__lienzo');
  var fondo=sec.querySelector('.pl-fondo');
  var fichas=[].slice.call(sec.querySelectorAll('.pl-ficha')),n=fichas.length;
  var marquee=sec.querySelector('.plt-marquee');
  var quieto=root.classList.contains('quieto');
  var con=navigator.connection||{};
  var fino=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var wv=root.classList.contains('webview')||/Instagram|FBAN|FBAV/.test(navigator.userAgent);
  var liviano=quieto||wv||!!con.saveData;
  var fis=!liviano;
  var ligero=liviano||!fino||!matchMedia('(min-width:901px)').matches;
  if(ligero)escena.classList.add('es-ligero');
  if(fis)escena.classList.add('es-fisica');else escena.classList.add('es-quieta');
  var TAU=Math.PI*2,D2R=Math.PI/180;
  /* fuera los hilos y las elipses guía */
  [].slice.call(escena.querySelectorAll('.pl-hilos')).forEach(function(e){e.remove()});
  if(fondo)[].slice.call(fondo.querySelectorAll('i')).forEach(function(e){e.remove()});
  var colores=fichas.map(function(f){return getComputedStyle(f).getPropertyValue('--marca').trim()});
  var cuerpos=fichas.map(function(f){return f.querySelector('.pl-ficha__cuerpo')});
  var caras=fichas.map(function(f){return f.querySelector('.pl-ficha__cara')});
  var brillos=fichas.map(function(f){return f.querySelector('.pl-ficha__brillo')});

  /* ---- medidas (todo el movimiento vive en unidades S = ancho del rd) ---- */
  var W=0,H=0,cx=0,cy=0,S=1,FI=60,EF=1;
  function medir(){
    W=escena.clientWidth;H=escena.clientHeight;S=rd.clientWidth||W*0.5;FI=fichas[0].offsetWidth||60;
    cx=W*0.5;cy=rd.offsetTop+S*0.54;EF=W<560?0.84:1;
    dimensionarLienzos();
    if(!fis)pintarEstatico();
  }
  function ease(x){x=x<0?0:x>1?1:x;return 1-Math.pow(1-x,3)}
  function cl(v,a,b){return v<a?a:v>b?b:v}
  function soft(v,m){var a=Math.abs(v),k=m*0.68;if(a<k)return v;return (v<0?-1:1)*(k+(m-k)*Math.tanh((a-k)/(m-k)))}

  /* ======================= trayectorias ======================= */
  /* pozos de gravedad (en S, relativos al centro del rd): 0 = centro, 1 = cuenco de la d, 2 = la r */
  var POZOS=[[0,0.02],[0.13,0.07],[-0.25,0.05]];
  function rot(x,y,inc,O){var ci=Math.cos(inc),si=Math.sin(inc),yy=y*ci,z=y*si,cO=Math.cos(O),sO=Math.sin(O);return [x*cO-yy*sO,x*sO+yy*cO,z]}
  function kepler(p,t){
    var M=p.M+p.n*t,e=p.e,E=M;for(var k=0;k<4;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
    var x=p.a*(Math.cos(E)-e),y=p.a*Math.sqrt(1-e*e)*Math.sin(E),w=p.o+p.od*t,cw=Math.cos(w),sw=Math.sin(w);
    return rot(x*cw-y*sw,x*sw+y*cw,p.i,p.O+p.Od*t);
  }
  function lemn(p,t){
    var s=p.M+p.n*t,c=Math.cos(s),sn=Math.sin(s),d=1+sn*sn,r=rot(p.a*c/d,p.a*sn*c/d,p.i,p.O+p.Od*t);
    r[2]+=p.zA*Math.sin(s);return r;
  }
  function espi(p,t){
    var s=p.M+p.n*t,r=p.r0+p.dr*Math.sin(p.k*s+p.ph);
    return rot(r*Math.cos(s),r*Math.sin(s),p.i,p.O+p.Od*t);
  }
  function liss(p,t){
    var r=[p.Ax*Math.sin(p.fx*t+p.px),p.Ay*Math.sin(p.fy*t+p.py),p.Az*Math.sin(p.fz*t+p.pz)];
    if(p.i){var q=rot(r[0],r[1],p.i,p.O);q[2]+=r[2];return q}return r;
  }
  function nK(a,k){return (k||0.40)*Math.pow(a,-1.5)}
  /* constructores: ángulos en grados, tamaños en S */
  function K(w,a,e,i,O,o,k,Od,M){return {f:kepler,w:w,a:a,e:e,i:i*D2R,O:O*D2R,o:o*D2R,n:nK(a,k),od:0.03,Od:(Od||5)*D2R*0.1,M:M||0}}
  function L(w,a,i,O,zA,n,M){return {f:lemn,w:w,a:a,i:i*D2R,O:O*D2R,zA:zA,n:n,Od:0.04,M:M||0}}
  function R(w,r0,dr,k,i,O,n,M,ph){return {f:espi,w:w,r0:r0,dr:dr,k:k,ph:ph||0,i:i*D2R,O:O*D2R,Od:0.05,n:n,M:M||0}}
  function Q(w,Ax,Ay,Az,fx,fy,fz,ph,i,O){return {f:liss,w:w,Ax:Ax,Ay:Ay,Az:Az,fx:fx,fy:fy,fz:fz,px:ph[0],py:ph[1],pz:ph[2],i:(i||0)*D2R,O:(O||0)*D2R}}
  var REG=[[],[],[],[]];
  /* 0 · libre: mezcla a mano de planos, tamaños y velocidades; cinco giran sobre la d */
  REG[0]=[
    K(1,.74,.30,58,-25,20,.40,6,.4), K(0,.88,.22,-32,50,100,.44,-5,2.2), K(1,.60,.12,82,15,0,.46,4,4.1),
    L(0,.82,25,-10,.5,.42,1.0), K(0,.80,.40,70,-70,150,.40,-6,5.0), R(1,.66,.16,.43,40,110,.52,3.3,1),
    K(2,.55,.20,50,30,60,.46,5,1.3), Q(0,.82,.62,.55,.52,.67,.41,[0,1.9,3.4],14,20), K(1,.90,.45,15,-40,200,.38,-4,2.9),
    L(0,.78,-50,70,.55,.40,4.4)];
  /* 1 · polar: aros verticales como meridianos, pasando por encima y por debajo del rd */
  REG[1]=fichas.map(function(_,i){return K(i%3===1?1:0,.62+.03*(i%4),.14+.03*(i%5),76+(i*7)%30,i*19-70,i*30,.44,6,i*0.9)});
  /* 2 · ocho: lemniscatas con un lóbulo sobre la r y otro sobre la d; cada cruce pasa una vez delante y otra detrás */
  REG[2]=fichas.map(function(_,i){return L(0,.72+.02*(i%4),[20,-20,40,-40,60,-60,10,-10,50,-30][i],i*36,.52,.44+.02*(i%3),i*.63)});
  /* 3 · enjambre: rosetones que se acercan y se alejan del rd */
  REG[3]=fichas.map(function(_,i){return R(i%2?1:0,.64,.2,.31+.07*(i%5),(i*23)%70-20,i*37,.62+.07*(i%4),i*.7,i)});
  var NOMBRES=['órbitas libres','órbitas polares','órbitas en ocho','enjambre en espiral'];
  var reg=[1,0,0,0];     /* pesos suavizados de cada régimen */
  var vP=[0,0,0];
  function trayecto(i,t,w){
    var x=0,y=0,z=0;
    for(var r=0;r<4;r++){var wr=w[r];if(wr<0.002)continue;var p=REG[r][i],v=p.f(p,t),po=POZOS[p.w||0];x+=wr*(v[0]+po[0]);y+=wr*(v[1]+po[1]);z+=wr*v[2]}
    vP[0]=x;vP[1]=y;vP[2]=z;return vP;
  }

  /* ---- estado ---- */
  var reloj=0,activa=-1,hov=-1,fij=-1;
  var px=0,py=0,tx=0,ty=0,prog=0;
  var B=[],regManual=-1,progManual=0,golpeRd=0,empujeRd={x:0,y:0,vx:0,vy:0},iman=null,ptr={x:0,y:0,vx:0,vy:0,t:0,dentro:false,mouse:false,abajo:false};
  var grav={x:0,y:0},dedo={x:0,y:0},cam={x:0,y:0},q=2,fpsM=60,lentoT=0,pausado=false,gT=1,proxRafaga=7,ultLuz=0;
    var STAGE=[0,0.4,0.95];

  function crearCuerpos(){
    B=fichas.map(function(f,i){return {tau:i*0.37,ox:0,oy:0,oz:0,vx:0,vy:0,vz:0,pos:[0,0,0],pv:[0,0,0],px:0,py:0,sc:1,mp:0,mpv:0,rate:1,
      fa:0,fv:0,fb:0,fbT:0,fph:i*1.9+0.7,fper:0.74+((i*37)%10)/16,hold:0,rel:true,t0:i*ENERGIA.escalonado,vis:0,vf:-1,zi:0,blur:-1,gx:-1,gy:-1,lado:-1,hit:0}});
  }

  /* ======================= proyección ======================= */
  /* pos en S (z>0 hacia el espectador) → pantalla en px, escala; el paralaje de cámara depende de la profundidad */
  function proyectar(b,p){
    var z=p[2],f=1/(1-0.3*z),X=p[0]+cam.x*z*0.10,Y=p[1]+cam.y*z*0.08;
    X*=f;Y*=f;
    var Xm=(W*0.5-FI*0.5)/S,Yu=(cy-FI*0.6)/S,Yd=(H-cy-FI*0.75)/S;
    X=soft(X,Xm);Y=Y<0?-soft(-Y,Yu):soft(Y,Yd);
    b.px=cx+X*S;b.py=cy+Y*S;b.sc=cl(f*0.9,0.55,1.5)*EF;
  }

  /* ======================= física ======================= */
  function giro(b,v){b.fv=cl(b.fv+v*GIRO_PROPIO.golpe,-GIRO_PROPIO.vmax,GIRO_PROPIO.vmax)}
  function patear(b,fx,fy,fz,giroF){b.vx+=fx;b.vy+=fy;b.vz+=fz;giro(b,giroF)}
  function estallar(fuerza){
    fuerza=fuerza||1;golpeRd=1;
    B.forEach(function(b){var dx=b.pos[0],dy=b.pos[1],dz=b.pos[2]*0.5,d=Math.hypot(dx,dy,dz)||1,v=(1.5+Math.random()*1.2)*fuerza*ENERGIA.estallido;
      patear(b,dx/d*v,dy/d*v-0.15,dz/d*v,(Math.random()<.5?-1:1)*(1200+Math.random()*1200))});
    esquirlas();onda(cx,cy,'');
  }
  function cambiarRegimen(){
    regManual=((regManual<0?regActual():regManual)+1)%4;progManual=prog;
    B.forEach(function(b,i){giro(b,(i%2?-1:1)*(700+i*60))});anunciar(NOMBRES[regManual]);
  }
  function regActual(){var m=0;for(var r=1;r<4;r++)if(reg[r]>reg[m])m=r;return m}
  var voz=null;function anunciar(t){if(!voz){voz=document.createElement('span');voz.className='visually-hidden pl-voz';voz.setAttribute('aria-live','polite');escena.appendChild(voz)}voz.textContent='Régimen: '+t}

  var vel0=[0,0,0];
  function fisica(t,dt){
    if(!W)return;
    /* régimen según el scroll: entra en enjambre, al centro libre, sale en polar; el toque al rd lo cambia */
    if(regManual>-1&&Math.abs(prog-progManual)>0.45)regManual=-1;
    var s=(1-prog)/2,w0=[1,0,0,0];
    if(regManual>-1){w0=[0,0,0,0];w0[regManual]=1}
    else if(s<0.34){var m=ease(s/0.34);w0=[m,0,0,1-m]}else if(s>0.64){var m2=ease((s-0.64)/0.3);w0=[1-m2,m2,0,0]}
    var kr=Math.min(1,dt*ENERGIA.regimen);for(var r=0;r<4;r++)reg[r]+=(w0[r]-reg[r])*kr;
    var gTobj=pausado?0.03:1;gT+=(gTobj-gT)*Math.min(1,dt*3);
    var cax=cl(px*0.9+grav.x+dedo.x,-1.3,1.3),cay=cl(py*0.9+grav.y+dedo.y,-1.3,1.3);
    cam.x+=(cax-cam.x)*Math.min(1,dt*ENERGIA.camara);cam.y+=(cay-cam.y)*Math.min(1,dt*ENERGIA.camara);
    dedo.x*=Math.pow(0.2,dt);dedo.y*=Math.pow(0.2,dt);
    var KS=AMORTIGUACION.resorte,CS=AMORTIGUACION.freno,rm=0.10;
    var pxS=(ptr.x-cx)/S,pyS=(ptr.y-cy)/S,pvS=Math.hypot(ptr.vx,ptr.vy);
    for(var i=0;i<n;i++){
      var b=B[i];
      /* reloj propio: se frena cerca del puntero y del todo si la medalla está en foco */
      var rt=1;
      if(ptr.dentro&&(ptr.mouse||ptr.abajo)){var dd=Math.hypot(b.px-ptr.x,b.py-ptr.y)/S;rt=1-0.82*cl((0.5-dd)/0.5,0,1)}
      if(i===hov||i===fij)rt=0.06;
      b.rate+=(rt-b.rate)*Math.min(1,dt*6);
      b.tau+=dt*b.rate*gT*ENERGIA.vel;
      var P=trayecto(i,b.tau,reg),Px=P[0],Py=P[1],Pz=P[2];
      /* velocidad de la trayectoria */
      b.pv[0]=(Px-b.pos[0]+b.ox)/Math.max(dt,0.004);
      /* desviación: resorte elástico que devuelve a la órbita */
      var ax=-KS*b.ox-CS*b.vx,ay=-KS*b.oy-CS*b.vy,az=-KS*b.oz-CS*b.vz;
      var sx=Px+b.ox,sy=Py+b.oy;
      if(b.rel){
        /* imán: mantener presionado el fondo */
        if(iman){var mx=(iman.x-cx)/S-sx,my=(iman.y-cy)/S-sy,md=Math.hypot(mx,my)||1,fm=Math.min(14,md*20)*ENERGIA.iman;ax+=mx/md*fm;ay+=my/md*fm;ax-=b.vx*2.6;ay-=b.vy*2.6}
        /* puntero rápido = patada; la medalla en foco se asoma hacia el puntero */
        if(ptr.dentro&&!iman){
          var qx=sx-pxS,qy=sy-pyS,qd=Math.hypot(qx,qy),rr=FI*0.6*b.sc/S;
          if(i===hov&&ptr.mouse){ax+=cl(-qx,-ENERGIA.leanMax,ENERGIA.leanMax)*ENERGIA.leanPuntero;ay+=cl(-qy,-ENERGIA.leanMax,ENERGIA.leanMax)*ENERGIA.leanPuntero}
          else if(qd<rr*1.9&&pvS>650&&i!==fij){var fk=Math.min(2400,pvS)/S*0.0012*S/ S;patear(b,((qx/(qd||1))*0.9*Math.min(2.4,pvS/900)+ptr.vx/S*0.18)*ENERGIA.patada,((qy/(qd||1))*0.9*Math.min(2.4,pvS/900)+ptr.vy/S*0.18)*ENERGIA.patada,0,(ptr.vx>0?1:-1)*Math.min(2400,pvS*1.3))}
        }
      }
      b.vx+=ax*dt;b.vy+=ay*dt;b.vz+=az*dt;b.ox+=b.vx*dt;b.oy+=b.vy*dt;b.oz+=b.vz*dt;
      var X=Px+b.ox,Y=Py+b.oy,Z=Pz+b.oz;
      /* viaje al frente: de la órbita al escenario con un poco de rebote */
      var obj=i===fij?1:0;
      b.mpv+=((obj-b.mp)*34-b.mpv*7)*dt;b.mp+=b.mpv*dt;if(b.mp<0.0005&&obj===0&&Math.abs(b.mpv)<0.01){b.mp=0;b.mpv=0}
      if(b.mp!==0){X+=(STAGE[0]-X)*b.mp;Y+=(STAGE[1]-Y)*b.mp;Z+=(STAGE[2]-Z)*b.mp}
      /* choque con el rd: elipsoide sólido, salvo la medalla que viaja al frente */
      if(b.rel&&b.mp<0.2){
        var ax2=0.50+rm,ay2=0.44+rm,az2=0.15+rm,ex=X/ax2,ey=(Y-0.02)/ay2,ez=Z/az2,e2=ex*ex+ey*ey+ez*ez;
        if(e2<1&&e2>1e-6){var e1=Math.sqrt(e2),nx=ex/ax2,ny=ey/ay2,nz=ez/az2,nl=Math.hypot(nx,ny,nz)||1;nx/=nl;ny/=nl;nz/=nl;
          var push=(1/e1-1)*Math.min(ax2,ay2,az2)*0.9;b.ox+=nx*push;b.oy+=ny*push;b.oz+=nz*push;X+=nx*push;Y+=ny*push;Z+=nz*push;
          var vn=b.vx*nx+b.vy*ny+b.vz*nz+(b.pv[0]*nx)*0;
          if(vn<0){b.vx-=ENERGIA.rebote*vn*nx;b.vy-=ENERGIA.rebote*vn*ny;b.vz-=ENERGIA.rebote*vn*nz;giro(b,-vn*500*(nx>0?1:-1))}
          if(vn<-0.3){golpeRd=Math.min(0.6,golpeRd+Math.min(0.25,-vn*0.25));empujeRd.vx-=nx*0.2*S*0.1;empujeRd.vy-=ny*0.2*S*0.1}}
      }
      b.pos[0]=X;b.pos[1]=Y;b.pos[2]=Z;
      /* giro propio v5.1: balanceo suave (yaw) alrededor de "de cara"; nunca se acerca a los 90 grados (canto).
         El volteo completo (fbT += 180) solo ocurre al activar la medalla y es lento. */
      var G=GIRO_PROPIO,foco=i===hov||i===fij,ytar=foco?0:G.amp*Math.sin(b.tau*TAU/G.periodo*b.fper+b.fph);
      b.fb+=(b.fbT-b.fb)*Math.min(1,dt*G.volteo);
      var tgt=b.fb+ytar;
      b.fv+=((tgt-b.fa)*G.rigidez-b.fv*G.freno)*dt;b.fa+=b.fv*dt;
      var dev=b.fa-tgt;if(dev>G.tope){b.fa=tgt+G.tope;if(b.fv>0)b.fv=0}else if(dev<-G.tope){b.fa=tgt-G.tope;if(b.fv<0)b.fv=0}
      b.vis=cl((reloj-b.t0)/ENERGIA.aparece,0,1);
    }
    /* choques entre medallas (esferas 3D: si cruzan a distinto fondo, pasan de largo) */
    if(q>1)for(var i2=0;i2<n;i2++)for(var j=i2+1;j<n;j++){
      var p=B[i2],r2=B[j];if(!p.rel||!r2.rel)continue;
      var dx=r2.pos[0]-p.pos[0],dy=r2.pos[1]-p.pos[1],dz=(r2.pos[2]-p.pos[2])*1.2,dd2=Math.hypot(dx,dy,dz),mn=rm*2.05;
      if(dd2<mn&&dd2>0.001){var ux=dx/dd2,uy=dy/dd2,uz=dz/dd2,ov=(mn-dd2)*0.5;
        p.ox-=ux*ov;p.oy-=uy*ov;p.oz-=uz*ov;r2.ox+=ux*ov;r2.oy+=uy*ov;r2.oz+=uz*ov;
        var rel=(r2.vx-p.vx)*ux+(r2.vy-p.vy)*uy+(r2.vz-p.vz)*uz;
        if(rel<0){var im=-rel*ENERGIA.choque;p.vx-=im*ux;p.vy-=im*uy;p.vz-=im*uz;r2.vx+=im*ux;r2.vy+=im*uy;r2.vz+=im*uz;if(-rel>0.5){giro(p,rel*500);giro(r2,-rel*500)}}}
    }
    /* un golpe de giro cada pocos segundos para que ninguna se vea mecánica */
    proxRafaga-=dt;if(proxRafaga<0&&fij<0&&hov<0){proxRafaga=AMORTIGUACION.rafaga[0]+Math.random()*AMORTIGUACION.rafaga[1];var bb=B[(Math.random()*n)|0];giro(bb,(Math.random()<.5?-1:1)*1100);bb.vy-=0.05}
    /* el rd siente a sus satélites: se inclina hacia donde está la masa y responde a los choques */
    var bx=0,by=0,bm=0;for(i=0;i<n;i++){var bq=B[i];if(!bq.rel)continue;var dm=Math.hypot(bq.pos[0],bq.pos[1]);if(dm<1.1){bx+=bq.pos[0]*(1.1-dm);by+=bq.pos[1]*(1.1-dm);bm+=1}}
    var lx=bm?bx/10:0,ly=bm?by/10:0;empujeRd.lx=(empujeRd.lx||0)+(lx-(empujeRd.lx||0))*Math.min(1,dt*2);empujeRd.ly=(empujeRd.ly||0)+(ly-(empujeRd.ly||0))*Math.min(1,dt*2);
    empujeRd.vx+=(-empujeRd.x*90-empujeRd.vx*9)*dt;empujeRd.vy+=(-empujeRd.y*90-empujeRd.vy*9)*dt;empujeRd.x+=empujeRd.vx*dt;empujeRd.y+=empujeRd.vy*dt;
    golpeRd*=Math.pow(0.04,dt);
    escribir(t,dt);
  }

  /* ---- salida al DOM y a los lienzos ---- */
  var orden=[];
  function escribir(t,dt){
    for(var i=0;i<n;i++){
      var b=B[i],f=fichas[i];
      proyectar(b,b.pos);
      var sc=b.sc*(0.6+0.4*ease(b.vis))*(i===fij?1+b.mp*0.5:1);
      var roll=cl((b.px-(b.lx||b.px))*0.9*ENERGIA.cabeceo,-7,7);b.lx=b.px;
      f.style.transform='translate3d('+(b.px-W*0.5).toFixed(1)+'px,'+(b.py-H*0.5).toFixed(1)+'px,0) rotate('+roll.toFixed(1)+'deg) scale('+sc.toFixed(3)+')';
      var z=b.pos[2],lejos=cl((-z-0.1)/0.8,0,1),op=(b.vis*(0.8+0.2*(1-lejos))).toFixed(2);
      if(f._op!==op){f.style.opacity=op;f._op=op}
      lado(f,b);
      /* desenfoque y brillo por profundidad (cuantizados: casi nunca se reescribe) */
      var dz=z-0.1,bl=i===fij||i===hov?0:dz<-0.35?(-dz-0.35)*2.2:dz>0.8?(dz-0.8)*3:0;
      bl=q>1?Math.round(Math.min(1.7,bl)*3)/3:0;var br=Math.round((1-0.14*lejos)*20)/20;
      var kf=bl*10+br;if(b.blur!==kf){cuerpos[i].style.filter=(bl||br<1)?(bl?'blur('+bl.toFixed(2)+'px) ':'')+'brightness('+br+')':'none';b.blur=kf}
      /* cuadro del volteo (16 cuadros = media vuelta) */
      var a=((b.fa%180)+180)%180,ys=b.fa-180*Math.round(b.fa/180),k=Math.round(a/11.25)%16,vf=hayVolteo&&k!==0?k:-1;
      if(vf!==b.vf){if(vf<0){f.classList.remove('es-volteo');caras[i].style.backgroundPosition=''}else{if(b.vf<0)f.classList.add('es-volteo');caras[i].style.backgroundPosition=(vf*100/15).toFixed(3)+'% '+(i*100/9).toFixed(3)+'%'}b.vf=vf}
      /* destello especular: recorre la cara con el giro y sigue la altura respecto a la luz */
      var gx=Math.round(cl(50+ys*0.42,16,84)),gy=Math.round(cl(26+(b.py-cy)/S*22,10,60));
      if(!f.classList.contains('es-activa')&&(Math.abs(gx-b.gx)>2||Math.abs(gy-b.gy)>3)){cuerpos[i].style.setProperty('--gx',gx+'%');cuerpos[i].style.setProperty('--gy',gy+'%');b.gx=gx;b.gy=gy}
    }
    /* orden de profundidad: detrás del rd (1-9) y delante (30-39); la fijada, arriba de todo */
    for(i=0;i<n;i++)orden[i]=i;
    orden.sort(function(p,r){return B[p].pos[2]-B[r].pos[2]});
    for(var rk=0;rk<n;rk++){var ib=orden[rk],bz=B[ib],zi=ib===fij?60:(bz.pos[2]<0?2+rk:30+rk);if(bz.zi!==zi){fichas[ib].style.zIndex=zi;bz.zi=zi}}
    if(fondo){fondo.style.setProperty('--fx',(cam.x*-12).toFixed(1)+'px');fondo.style.setProperty('--fy',(cam.y*-10).toFixed(1)+'px')}
    var resp=Math.sin(t*1.3)*0.012+golpeRd*0.08;
    rd.style.transform='translate3d('+(empujeRd.x+(empujeRd.lx||0)*S*0.05+cam.x*-9+px*-4).toFixed(1)+'px,'+(empujeRd.y+(empujeRd.ly||0)*S*0.05+cam.y*-7+py*-3+Math.sin(t*0.7)*3).toFixed(1)+'px,0) scale('+(1+resp).toFixed(4)+')';
    rd.style.setProperty('--golpe',golpeRd.toFixed(3));
    if(est){var ek=Math.floor((performance.now()-est)/42);if(ek>15){est=0;estallido.style.opacity=0}else if(ek!==estK){estK=ek;estallido.style.backgroundPosition=(ek%4)*100/3+'% '+(ek/4|0)*100/3+'%';estallido.style.opacity=1}}
    dibujar(t,dt);
  }
  function lado(f,b){var xx=b.px,l=xx>W*0.8?2:xx<W*0.2?1:0;if(b.lado!==l){f.classList.toggle('lbl-der',l===2);f.classList.toggle('lbl-izq',l===1);b.lado=l}}

  /* ---- lienzos: sombra sobre el piso ---- */
  var cAt=null,xAt=null,dpr=1,sombraSpr=null,sombraRGB='46,40,36';
  function crearLienzos(){
    if(cAt)return;
    function mk(cl){var c=document.createElement('canvas');c.className=cl;c.setAttribute('aria-hidden','true');escena.appendChild(c);return c}
    cAt=mk('pl-lz pl-lz--atras');xAt=cAt.getContext('2d');
    /* color de sombra de la casa */
    try{var tmp=document.createElement('i');tmp.style.color=getComputedStyle(sec).getPropertyValue('--pl-sombra')||'';tmp.style.display='none';sec.appendChild(tmp);var m=getComputedStyle(tmp).color.match(/[\d.]+/g);sec.removeChild(tmp);if(m&&m.length>=3)sombraRGB=(+m[0]|0)+','+(+m[1]|0)+','+(+m[2]|0)}catch(_){}
    var s=document.createElement('canvas');s.width=96;s.height=48;var g=s.getContext('2d'),gr=g.createRadialGradient(48,24,0,48,24,48);
    gr.addColorStop(0,'rgba('+sombraRGB+',.9)');gr.addColorStop(0.45,'rgba('+sombraRGB+',.38)');gr.addColorStop(1,'rgba('+sombraRGB+',0)');
    g.setTransform(1,0,0,.5,0,12);g.fillStyle=gr;g.fillRect(0,-24,96,96);sombraSpr=s;
  }
  function dimensionarLienzos(){
    if(!cAt)return;dpr=Math.min(window.devicePixelRatio||1,fino?1.5:1.25);
    cAt.width=Math.round(W*dpr);cAt.height=Math.round(H*dpr);
  }
  var PISO=0.58;
  function sombras(x){
    var ord=orden.length?orden:fichas.map(function(_,i){return i});
    for(var k=0;k<ord.length;k++){var i=ord[k],b=B[i];if(!b||b.vis<=0.02)continue;
      var piso=cy+(PISO+b.pos[2]*0.15)*S,h=cl((piso-b.py)/(1.7*S),0,1),w=FI*b.sc*(1.0+1.1*h),al=(0.27*(1-h)+0.03)*b.vis*(i===fij?0.9:1);
      x.globalAlpha=al;x.drawImage(sombraSpr,b.px-w*0.5,piso-w*0.25,w,w*0.5)}
    x.globalAlpha=1;
  }
  /* sin estelas ni rastros: el lienzo solo pinta la sombra suave sobre el piso */
  function dibujar(t,dt){
    if(!cAt)return;
    xAt.setTransform(dpr,0,0,dpr,0,0);xAt.clearRect(0,0,W,H);
    if(q>0)sombras(xAt);
  }
  function luz(i){if(!fis||!B[i]||reloj-ultLuz<0.35)return;ultLuz=reloj;onda(cx,cy,colores[i])}
  function onda(x,y,c){var o=escena.querySelector('.pl-onda');if(!o)return;if(c)o.style.setProperty('--c',c);else o.style.removeProperty('--c');o.style.left=x+'px';o.style.top=y+'px';o.classList.remove('es-viva');void o.offsetWidth;o.classList.add('es-viva')}

  /* ---- composición quieta (modos livianos): una foto de las órbitas, sin bucle ---- */
  /* el instante de la órbita en que las diez quedan mejor repartidas (sin tapar el rd ni amontonarse) */
  var _foto=null;
  function fotoT(){
    if(_foto!==null)return _foto;
    var w1=[1,0,0,0],mejor=-9,mt=2.3,pos=[];
    for(var t=1;t<30;t+=0.25){
      pos=[];for(var i=0;i<n;i++){var P=trayecto(i,t,w1);pos.push([P[0],P[1],P[2]])}
      var mn=9,pen=0;
      for(i=0;i<n;i++){var a=pos[i];if(Math.abs(a[2])<0.22&&Math.hypot(a[0],a[1])<0.62)pen+=1;if(Math.abs(a[0])>0.95||a[1]<-0.78||a[1]>0.78)pen+=0.5;
        for(var j=i+1;j<n;j++){var c=pos[j],d=Math.hypot(a[0]-c[0],a[1]-c[1],(a[2]-c[2])*0.6);if(d<mn)mn=d}}
      var sc=mn-pen*0.4;if(sc>mejor){mejor=sc;mt=t}
    }
    return (_foto=mt);
  }
  function pintarEstatico(){
    if(!W||!B.length)return;
    var w1=[1,0,0,0],tt=fotoT();
    for(var i=0;i<n;i++){var b=B[i],P=trayecto(i,tt,w1);b.pos[0]=P[0];b.pos[1]=P[1];b.pos[2]=P[2];b.rel=true;b.vis=1;
      if(i===fij){b.pos[0]=STAGE[0];b.pos[1]=STAGE[1];b.pos[2]=STAGE[2]}}
    var o=fichas.map(function(_,i){return i}).sort(function(p,r){return B[p].pos[2]-B[r].pos[2]});
    for(var k=0;k<n;k++){var i2=o[k],bq=B[i2];proyectar(bq,bq.pos);var f=fichas[i2],sc=bq.sc*(i2===fij?1.5:1),z=bq.pos[2],lejos=cl((-z-0.1)/0.8,0,1);
      f.style.transform='translate3d('+(bq.px-W*0.5).toFixed(1)+'px,'+(bq.py-H*0.5).toFixed(1)+'px,0) scale('+sc.toFixed(3)+')';
      f.style.opacity=(0.8+0.2*(1-lejos)).toFixed(2);f.style.zIndex=i2===fij?60:(z<0?2+k:30+k);lado(f,bq);
      var bl=i2===fij?0:z<-0.45?Math.min(1,(-z-0.45)*1.4):0;cuerpos[i2].style.filter=bl?'blur('+bl.toFixed(2)+'px) brightness('+(1-0.14*lejos).toFixed(2)+')':'none'}
    orden=o;
    if(cAt){xAt.setTransform(dpr,0,0,dpr,0,0);xAt.clearRect(0,0,W,H);sombras(xAt)}
    rd.style.transform='';
  }

  /* hojas Blender bajo demanda: volteo de medallas (AVIF 191 KB / WebP 374 KB) y esquirlas (60 / 84 KB) */
  var hayVolteo=false,hayEsq=false,estallido=null,est=0,estK=-1;
  function hoja(base,listo){var pic=document.createElement('picture'),so=document.createElement('source'),im=new Image();so.type='image/avif';so.srcset=base+'.avif';pic.appendChild(so);im.decoding='async';
    im.onload=function(){listo(im.currentSrc||im.src)};im.src=base+'.webp';pic.appendChild(im)}
  function pedirHojas(){
    if(pedirHojas.ya||!fis)return;pedirHojas.ya=1;var b='assets/_efectos/blender/plataformas_v4/';
    hoja(b+'volteo',function(u){escena.style.setProperty('--pl-hoja-v','url("'+u+'")');hayVolteo=true});
    estallido=document.createElement('span');estallido.className='pl-estallido';estallido.setAttribute('aria-hidden','true');rd.appendChild(estallido);
    hoja(b+'esquirlas',function(u){estallido.style.backgroundImage='url("'+u+'")';hayEsq=true});
  }
  function esquirlas(){if(hayEsq){est=performance.now();estK=-1}}

  /* ======================= rd vivo (escritorio) =======================
     WebGL en vivo con el MISMO motor del hero (js/rd3d.min.js, giro() en modo control: misma geometría, negro mate, estudio, sombra de
     contacto y reflejo en el piso). Este bucle (el único reloj) le pasa el ángulo, el puntero, el golpe y el tono; el lienzo 2D queda
     encima solo para las chispas. Sin WebGL2 o si el módulo falla: los 72 cuadros Blender de antes (Canvas 2D). */
  var cuadros=[],cargados=0,N=+rd.getAttribute('data-n')||72,ctx=null,ang=0,angVel=0,arrastre=null,tinte=0,tinteC='',chispas=[],gl3=null,pidioGl=0;
  function cargarCuadros(){
    if(ligero||pidioGl||cuadros.length||!lienzo.getContext)return;pidioGl=1;
    for(var i=0;i<26;i++)chispas.push({a:Math.random()*TAU,r:0.25+Math.random()*0.25,v:0.15+Math.random()*0.35,f:Math.random(),z:Math.random()});
    var ok=0;try{var tg=document.createElement('canvas').getContext('webgl2');if(tg){ok=1;var lc=tg.getExtension('WEBGL_lose_context');lc&&lc.loseContext()}}catch(_){}
    if(!ok)return cargarCuadros2D();
    import(new URL('js/rd3d.min.js',document.baseURI).href).then(function(m){
      return m.giro(rd,{control:true,zona:sec,antes:lienzo,clase:'pl-rd__gl',vivo:['es-vivo'],lado:1,reflejo:.24,fondoReflejo:.3,exp:2,
        estilo:'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none',
        cam:{fov:24,pos:[0,.66,3.55],mira:[0,.36,0]},alFallar:function(){gl3=null;cargarCuadros2D()}});
    }).then(function(g){gl3=g;ctx=lienzo.getContext('2d');window.__plGl=g}).catch(function(e){console.warn('rd plataformas',e&&e.message);cargarCuadros2D()});
  }
  function cargarCuadros2D(){
    if(cuadros.length)return;
    var base=rd.getAttribute('data-giro');ctx=lienzo.getContext('2d');
    var orden=[];for(var k=0;k<N;k+=6)orden.push(k);for(k=0;k<N;k++)if(k%6)orden.push(k);
    for(var i=0;i<N;i++)cuadros.push(null);
    var cola=orden.slice(),vivos=0;
    function sigue(){while(vivos<6&&cola.length){(function(k){vivos++;var im=new Image();im.decoding='async';
      im.onload=function(){cuadros[k]=im;cargados++;if(k===0)rd.classList.add('es-vivo');vivos--;sigue()};
      im.onerror=function(){vivos--;sigue()};im.src=base+(k<10?'0':'')+k+'.webp'})(cola.shift())}}
    sigue();
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
    tinte+=((activa>-1?1:0)-tinte)*Math.min(1,dt*6);if(activa>-1)tinteC=colores[activa];
    var w=lienzo.width,h=lienzo.height;
    if(gl3){                                                    /* WebGL: ángulo continuo (sin pasos de 5°), luces en la escena 3D */
      gl3.pose({ang:ang*D2R,px:px,py:py,golpe:golpeRd,tinte:tinte,color:tinteC,t:t});
      ctx.clearRect(0,0,w,h);chispasRd(t,dt,w,h);return;
    }
    var k=((Math.round(ang/(360/N))%N)+N)%N;
    var im=cuadroMasCercano(k);if(!im)return;
    var barr=(t%7)/7;
    ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);ctx.drawImage(im,0,0,w,h);
    ctx.globalCompositeOperation='source-atop';
    var lx=w*(0.5+px*0.35),ly=h*(0.35+py*0.25),g=ctx.createRadialGradient(lx,ly,0,lx,ly,w*0.38);
    g.addColorStop(0,'rgba(255,255,255,'+(0.12+golpeRd*0.3).toFixed(2)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    if(barr<0.32){var bx=(barr/0.32)*w*1.8-w*0.4,lg=ctx.createLinearGradient(bx-w*0.12,0,bx+w*0.12,h*0.3);
      lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(0.5,'rgba(255,255,255,.16)');lg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,w,h)}
    if(golpeRd>0.02){ctx.globalAlpha=golpeRd*0.25;ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.globalAlpha=1}   /* destello al chocar */
    if(tinte>0.01&&tinteC){ctx.globalAlpha=tinte*0.6;var tg=ctx.createRadialGradient(w*0.5,h*0.55,0,w*0.5,h*0.55,w*0.55);
      tg.addColorStop(0,tinteC);tg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=tg;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1}
    ctx.globalCompositeOperation='source-over';
    chispasRd(t,dt,w,h);
  }
  function chispasRd(t,dt,w,h){
    if(q>0)for(var i=0;i<chispas.length;i++){var c=chispas[i];c.f+=dt*c.v*(0.25+golpeRd*2);if(c.f>1){c.f=0;c.a=Math.random()*TAU}
      var r=c.r*w*(1+golpeRd*0.6),xx=w*0.5+Math.cos(c.a+t*0.2)*r,yy=h*(0.78-c.f*0.6)+Math.sin(c.a)*r*0.25,al=Math.sin(c.f*Math.PI)*0.55;
      ctx.globalAlpha=al;ctx.fillStyle=tinte>0.3&&tinteC?tinteC:'#9A9A9A';ctx.beginPath();ctx.arc(xx,yy,1+c.z*1.6,0,TAU);ctx.fill()}
    ctx.globalAlpha=1;
    var canto=Math.abs(Math.sin(ang*Math.PI/180));rd.style.setProperty('--ax',(1-canto*0.55).toFixed(3));rd.style.setProperty('--ao',(0.75-canto*0.3).toFixed(3));
  }
  /* toque corto al rd = estallido + nueva figura (el arrastre lo sigue girando) */
  var toque=null;
  rd.addEventListener('pointerdown',function(e){toque={x:e.clientX,y:e.clientY,t:performance.now()};pedirPermiso()});
  rd.addEventListener('pointerup',function(e){if(!toque||!fis)return;var mov=Math.hypot(e.clientX-toque.x,e.clientY-toque.y);if(mov<8&&performance.now()-toque.t<350){estallar(1);cambiarRegimen();if(!corriendo)arrancar()}toque=null});
  rd.addEventListener('pointerdown',function(e){if(ligero)return;arrastre={x:e.clientX,a:ang,t:performance.now(),lx:e.clientX};rd.classList.add('es-arrastre');try{rd.setPointerCapture(e.pointerId)}catch(_){}});
  rd.addEventListener('pointermove',function(e){if(!arrastre)return;var now=performance.now(),dx=e.clientX-arrastre.lx,dtm=Math.max(8,now-arrastre.t);
    ang=arrastre.a+(e.clientX-arrastre.x)*0.9;angVel=angVel*0.6+(dx*0.9/(dtm/1000))*0.4;arrastre.lx=e.clientX;arrastre.t=now});
  function soltar(){if(!arrastre)return;arrastre=null;rd.classList.remove('es-arrastre')}
  rd.addEventListener('pointerup',soltar);rd.addEventListener('pointercancel',soltar);
  var ayudaRd=fis?'; Enter dispara las medallas y cambia el régimen de órbita':'';
  if(!ligero){rd.tabIndex=0;rd.setAttribute('aria-label','Monograma rd de Ricardo Design en negro mate; gíralo con las flechas o arrastrándolo'+ayudaRd);
    rd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){angVel+=(e.key==='ArrowLeft'?-1:1)*420;e.preventDefault()}})}
  if(fis)rd.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();estallar(1);cambiarRegimen()}});

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
    rd.tabIndex=0;rd.setAttribute('aria-label','Monograma rd de Ricardo Design en negro mate; gíralo con las flechas o deslizando el dedo'+ayudaRd);
    rd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){pedirHoja();lVel+=(e.key==='ArrowLeft'?-1:1)*520;lMover();e.preventDefault()}});
  }

  /* ======================= inclinación del celular ======================= */
  var b0=null,permisoPedido=false,ultSacudida=0,escuchando=false;
  function alOrientar(e){if(e.gamma==null)return;if(b0===null)b0=e.beta;
    grav.x+=(cl(e.gamma/26,-1,1)-grav.x)*0.3;grav.y+=(cl((e.beta-b0)/26,-1,1)-grav.y)*0.3;
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
  var corriendo=false,usaGsap=false,ultimo=0,rafId=0,t0=0,entrada=ligero?1:0;
  function paso(ms){
    var tm0=performance.now(),dt=Math.max(0.001,Math.min(0.05,(ms-ultimo)/1000||0.016));ultimo=ms;reloj+=dt;
    if(entrada<1){var ahora=performance.now();if(!t0)t0=ahora;entrada=Math.min(1,(ahora-t0)/ENERGIA.entradaMs)}
    px+=(tx-px)*Math.min(1,dt*5);py+=(ty-py)*Math.min(1,dt*5);
    var r=sec.getBoundingClientRect(),vh=innerHeight;
    prog=Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/vh));
    ptr.vx*=Math.pow(0.02,dt);ptr.vy*=Math.pow(0.02,dt);
    /* calidad adaptable: sin desenfoque ni choques, luego sin sombras */
    fpsM=fpsM*0.95+(1/Math.max(dt,0.001))*0.05;
    if(fpsM<45){lentoT+=dt;if(lentoT>1.5&&q>0){q--;lentoT=0;sec.setAttribute('data-q',q);escena.classList.toggle('pl-q1',q<2);escena.classList.toggle('pl-q0',q<1);B.forEach(function(b){b.blur=-1})}}else lentoT=0;
    window.__plFps=fpsM;
    if(fis){hover();fisica(reloj,dt)}
    pintarRd(reloj,dt);if(lPasoExt)lPasoExt(dt);
    window.__plMs=(window.__plMs||0)*0.95+(performance.now()-tm0)*0.05;
  }
  function tickGsap(){paso(performance.now())}   /* el tiempo de gsap tiene otro origen que performance.now(): mezclarlos daba un dt negativo y retrasaba la entrada segundos */
  function tickRaf(ms){paso(ms);rafId=requestAnimationFrame(tickRaf)}
  function arrancar(){
    if(corriendo||!fis||document.hidden)return;corriendo=true;ultimo=performance.now();
    usaGsap=!!(window.gsap&&gsap.ticker);
    if(usaGsap)gsap.ticker.add(tickGsap);else rafId=requestAnimationFrame(tickRaf);
  }
  function parar(){if(!corriendo)return;corriendo=false;if(usaGsap)gsap.ticker.remove(tickGsap);else cancelAnimationFrame(rafId)}

  /* ======================= cursor propio del sitio ======================= */
  var cur=document.querySelector('.cursor');
  function cursor(modo,color){if(!cur)return;cur.classList.toggle('pl-sobre',modo===1);cur.classList.toggle('pl-gira',modo===2);if(color)cur.style.setProperty('--pl-cursor',color)}
  if(cur){rd.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')cursor(2)});rd.addEventListener('pointerleave',function(){cursor(0)})}

  /* ======================= foco, hover y fijar al frente ======================= */
  function refrescarActiva(){
    var nueva=fij>-1?fij:hov;if(nueva===activa)return;
    if(activa>-1){fichas[activa].classList.remove('es-activa');var ob=cuerpos[activa];ob.style.removeProperty('--rx');ob.style.removeProperty('--ry');if(B[activa])B[activa].gx=-1}
    activa=nueva;escena.classList.toggle('hay-activa',activa>-1);
    if(activa>-1){fichas[activa].classList.add('es-activa');escena.style.setProperty('--tono',colores[activa]);golpeRd=Math.max(golpeRd,0.3);luz(activa);cursor(1,colores[activa])}
    else cursor(0);
    if(!fis)pintarEstatico();
  }
  function setHov(i){if(i===hov)return;hov=i;refrescarActiva()}
  function fijar(i){
    if(i===fij)return;fij=i;if(i>-1&&fis&&B[i])B[i].fbT+=180;   /* volteo completo, lento, solo al activar */
    fichas.forEach(function(f,k){f.classList.toggle('es-fijada',k===i)});
    refrescarActiva();if(!fis)pintarEstatico();else if(!corriendo)arrancar();
  }
  var salida=0;
  /* el hover se calcula con las posiciones reales: las medallas se mueven y el DOM tarda en enterarse */
  function hover(){
    if(!fino||!ptr.mouse)return;
    if(!ptr.dentro||iman){if(hov>-1&&!ptr.dentro)setHov(-1);return}
    var pv=Math.hypot(ptr.vx,ptr.vy),best=-1,bz=-9;
    for(var i=0;i<n;i++){var b=B[i];if(!b.rel||b.vis<0.6)continue;
      var d=Math.hypot(b.px-ptr.x,b.py-ptr.y),r=FI*0.5*b.sc*(i===hov?1.45:1.08);
      if(d<r&&b.pos[2]>bz){best=i;bz=b.pos[2]}}
    if(best>-1){salida=0;if(best!==hov&&pv<900)setHov(best)}
    else if(hov>-1){if(!salida)salida=reloj;else if(reloj-salida>0.22){setHov(-1);salida=0}}
  }
  function inclinar(i,e){
    var f=fichas[i],b=f.getBoundingClientRect(),dx=(e.clientX-(b.left+b.width/2))/(b.width/2),dy=(e.clientY-(b.top+b.height/2))/(b.height/2);
    dx=cl(dx,-1,1);dy=cl(dy,-1,1);
    var c=cuerpos[i];c.style.setProperty('--ry',(dx*22).toFixed(1)+'deg');c.style.setProperty('--rx',(-dy*22).toFixed(1)+'deg');
    c.style.setProperty('--gx',(50+dx*30).toFixed(0)+'%');c.style.setProperty('--gy',(40+dy*30).toFixed(0)+'%');
  }
  fichas.forEach(function(f,i){
    f._foco=-1e9;
    f.addEventListener('click',function(){
      if(performance.now()-f._foco<400)return;           /* el clic que dio el foco ya la fijó */
      fijar(fij===i?-1:i);
      if(fis&&B[i]&&fij===i)B[i].vy-=0.08
    });
    f.addEventListener('focus',function(){f._foco=performance.now();fijar(i)});
    f.addEventListener('blur',function(){if(fij===i)fijar(-1)});
    f.addEventListener('pointermove',function(e){if(e.pointerType==='mouse'&&i===activa)inclinar(i,e)});
    if(!fis){f.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')setHov(i)});f.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')setHov(-1)})}
  });
  escena.addEventListener('keydown',function(e){if(e.key==='Escape'&&fij>-1){fijar(-1)}});
  /* pausa accesible: aparece al recibir foco con el teclado */
  if(fis){var bp=document.createElement('button');bp.type='button';bp.className='pl-pausa';bp.setAttribute('aria-pressed','false');bp.textContent='Pausar órbitas';
    bp.addEventListener('click',function(){pausado=!pausado;bp.setAttribute('aria-pressed',pausado?'true':'false');bp.textContent=pausado?'Reanudar órbitas':'Pausar órbitas'});
    escena.insertBefore(bp,escena.firstChild)}
  escena.addEventListener('pointermove',function(e){
    var b=escena.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,now=performance.now(),dtm=Math.max(8,now-(ptr.t||now-16));
    if(ptr.dentro){ptr.vx=ptr.vx*0.4+((x-ptr.x)/(dtm/1000))*0.6;ptr.vy=ptr.vy*0.4+((y-ptr.y)/(dtm/1000))*0.6}
    if(iman){iman.x=x;iman.y=y}
    if(fis&&e.pointerType!=='mouse'&&!iman){dedo.x=cl(dedo.x+(x-ptr.x)/160,-1.2,1.2);dedo.y=cl(dedo.y+(y-ptr.y)/160,-1.2,1.2)}  /* el dedo hace de inclinación */
    ptr.x=x;ptr.y=y;ptr.t=now;ptr.dentro=true;ptr.mouse=e.pointerType==='mouse';
    if(fino){tx=(x/b.width-0.5)*2;ty=(y/b.height-0.5)*2}
  });
  var tap=null;
  escena.addEventListener('pointerdown',function(e){
    var b=escena.getBoundingClientRect();ptr.x=e.clientX-b.left;ptr.y=e.clientY-b.top;ptr.dentro=true;ptr.abajo=true;ptr.mouse=e.pointerType==='mouse';
    if(!fis||e.target.closest('.pl-ficha')||e.target.closest('.pl-rd')||e.target.closest('.pl-pausa'))return;
    iman={x:ptr.x,y:ptr.y};tap={x:e.clientX,y:e.clientY,t:performance.now()};escena.classList.add('es-iman');if(!corriendo)arrancar()});
  function sueltaIman(e){ptr.abajo=false;if(!iman)return;
    if(tap&&e&&e.type==='pointerup'&&performance.now()-tap.t<260&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<10&&fij>-1)fijar(-1);   /* toque en el vacío suelta la fijada */
    iman=null;tap=null;escena.classList.remove('es-iman');B.forEach(function(b){giro(b,(Math.random()<.5?-1:1)*900)})}
  addEventListener('pointerup',sueltaIman);addEventListener('pointercancel',sueltaIman);
  escena.addEventListener('pointerleave',function(e){tx=ty=0;ptr.dentro=false;if(hov>-1)setHov(-1)});
  document.addEventListener('pointerdown',function(e){if(fij>-1&&!escena.contains(e.target))fijar(-1)},{passive:true});

  /* ======================= arranque perezoso y pausa fuera de pantalla ======================= */
  var listo=false,visible=false,cerca=false;
  function preparar(){
    if(listo)return;listo=true;crearCuerpos();crearLienzos();
    if(fis){fichas.forEach(function(f){f.style.opacity=0});var on=document.createElement('span');on.className='pl-onda';on.setAttribute('aria-hidden','true');escena.appendChild(on)}
    medir();
    if('ResizeObserver' in window)new ResizeObserver(function(){medir()}).observe(escena);else addEventListener('resize',medir);
  }
  /* a una pantalla de distancia: ya medido, con los cuerpos creados y los cuadros/hojas pidiéndose, para que al llegar estén de inmediato */
  /* 17 oct 2026 (fluidez): a una pantalla solo se prepara; el reloj corre únicamente con la escena a la vista (±150 px).
     Medido: con la escena de dispositivos fijada debajo, este bucle seguía vivo (getBoundingClientRect + física cada cuadro). */
  new IntersectionObserver(function(es){es.forEach(function(e){cerca=e.isIntersecting;if(cerca){preparar();cargarCuadros();pedirHojas()}else parar()})},{rootMargin:'100% 0px'}).observe(escena);
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      /* con menos de un cuarto de la escena a la vista (una franja en el borde mientras entra la escena de dispositivos)
         las fichas se quedan quietas: en celular esa franja costaba más que la escena que estaba entrando */
      visible=e.isIntersecting&&e.intersectionRatio>=.25;
      if(e.isIntersecting){preparar();sec.classList.add('plt--vista')}
      if(visible)arrancar();else parar();
    });
  },{threshold:[0,.25,.5]}).observe(escena);
  if(marquee)new IntersectionObserver(function(es){es.forEach(function(e){marquee.classList.toggle('esta-fuera',!e.isIntersecting)})}).observe(marquee);
  document.addEventListener('visibilitychange',function(){document.hidden?parar():(visible&&arrancar())});
  if(quieto)sec.classList.add('plt--vista');
  window.__pl={estallar:function(){estallar(1)},regimen:cambiarRegimen,q:function(){return q},fijar:fijar,estado:function(){return B.map(function(b){return {x:b.px,y:b.py,z:b.pos[2],sc:b.sc,zi:b.zi,a:b.fa}})}};
})();
