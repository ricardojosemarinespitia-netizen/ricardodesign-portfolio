/* Íconos 3D de la Garantía en tiempo real (WebGL1 propio, sin librerías).
   Un solo contexto WebGL fuera de pantalla dibuja los cuatro objetos (diana, reloj, documento, controles) y cada uno se copia
   a su <canvas> 2D dentro de .g3d; la sombra de contacto se pinta en ese mismo canvas (gradiente, sin filtros).
   Material: cerámica negra satinada con bisel brillante (Fresnel), insertos de metal oscuro pulido y acentos gris claro;
   luz de estudio analítica (dos cajas de luz + franja de borde + degradado), tono ACES y gamma.
   Movimiento: vaivén de ±32° (nunca de canto) + inclinación hacia el puntero y con el scroll; cada objeto "vive":
   segundero que barre, dardo que se clava y vibra, líneas que se escriben con su visto, perillas que se deslizan.
   API: window.G3D(lista de .g3d, opciones) -> {ok, foto(nombre, px)}; si no hay WebGL devuelve {ok:false}. */
(function () {
  var PI = Math.PI;
  /* ---------- matemáticas mínimas (mat4 columna mayor) ---------- */
  function I() { return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; }
  function mul(a, b) { var o = new Array(16), i, j; for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) o[j*4+i] = a[i]*b[j*4] + a[4+i]*b[j*4+1] + a[8+i]*b[j*4+2] + a[12+i]*b[j*4+3]; return o; }
  function T(x, y, z) { var m = I(); m[12] = x; m[13] = y; m[14] = z; return m; }
  function S(x, y, z) { var m = I(); m[0] = x; m[5] = y; m[10] = z; return m; }
  function RX(a) { var c = Math.cos(a), s = Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; }
  function RY(a) { var c = Math.cos(a), s = Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; }
  function RZ(a) { var c = Math.cos(a), s = Math.sin(a); return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]; }
  function M() { var m = I(); for (var i = 0; i < arguments.length; i++) m = mul(m, arguments[i]); return m; }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function ease(x) { x = cl(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
  function eio(x) { x = cl(x, 0, 1); return x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2; }

  /* ---------- geometría ---------- */
  /* caja redondeada: cada vértice = interior recortado + radio·dirección (bordes y esquinas exactos) */
  function rbox(w, h, d, r, sg) {
    sg = sg || 5; var P = [], N = [], X = [], hx = w/2, hy = h/2, hz = d/2;
    r = Math.min(r, hx, hy, hz);
    function lst(hh) { var L = [], k; for (k = sg; k >= 0; k--) L.push(-(hh - r) - r*Math.sin(k/sg*PI/2)); for (k = 0; k <= sg; k++) L.push((hh - r) + r*Math.sin(k/sg*PI/2)); return L; }
    var Lx = lst(hx), Ly = lst(hy), Lz = lst(hz), H = [hx, hy, hz], LL = [Lx, Ly, Lz];
    [[0,1,2],[0,2,1],[1,2,0]].forEach(function (ax) {
      [-1, 1].forEach(function (sgn) {
        var A = LL[ax[0]], B = LL[ax[1]], base = P.length/3, i, j;
        for (j = 0; j < B.length; j++) for (i = 0; i < A.length; i++) {
          var q = [0,0,0]; q[ax[0]] = A[i]; q[ax[1]] = B[j]; q[ax[2]] = sgn*H[ax[2]];
          var c = [cl(q[0], -(hx-r), hx-r), cl(q[1], -(hy-r), hy-r), cl(q[2], -(hz-r), hz-r)];
          var v = [q[0]-c[0], q[1]-c[1], q[2]-c[2]], l = Math.hypot(v[0], v[1], v[2]) || 1;
          v = [v[0]/l, v[1]/l, v[2]/l];
          P.push(c[0]+v[0]*r, c[1]+v[1]*r, c[2]+v[2]*r); N.push(v[0], v[1], v[2]);
        }
        var nA = A.length;
        for (j = 0; j < B.length-1; j++) for (i = 0; i < nA-1; i++) {
          var a = base + j*nA + i, b = a+1, c2 = a+nA, d2 = c2+1;
          var flip = (ax[2] === 1) ? sgn < 0 : sgn > 0;
          if (flip) X.push(a, b, d2, a, d2, c2); else X.push(a, d2, b, a, c2, d2);
        }
      });
    });
    return { p: P, n: N, i: X };
  }
  /* sección redondeada (r0..r1, profundidad d, bisel b) para tornear; r0=0 = disco macizo */
  function secc(r0, r1, d, b, sg) {
    sg = sg || 6; var o = [], z = d/2, k, a;
    function arco(cr, cz, a0, a1) { for (k = 0; k <= sg; k++) { a = a0 + (a1-a0)*k/sg; o.push([cr + b*Math.cos(a), cz + b*Math.sin(a), Math.cos(a), Math.sin(a)]); } }
    if (r0 > 0) arco(r0 + b, z - b, PI, PI/2); else o.push([0, z, 0, 1]);
    arco(r1 - b, z - b, PI/2, 0);
    arco(r1 - b, -z + b, 0, -PI/2);
    if (r0 > 0) { arco(r0 + b, -z + b, -PI/2, -PI); o.push(o[0]); } else o.push([0, -z, 0, -1]);
    return o;
  }
  /* torno alrededor del eje Z (el eje mira a la cámara) */
  function torno(pr, seg) {
    seg = seg || 72; var P = [], N = [], X = [], i, j, n = pr.length;
    for (j = 0; j <= seg; j++) { var a = j/seg*2*PI, c = Math.cos(a), s = Math.sin(a);
      for (i = 0; i < n; i++) { var q = pr[i]; P.push(q[0]*c, q[0]*s, q[1]); N.push(q[2]*c, q[2]*s, q[3]); } }
    for (j = 0; j < seg; j++) for (i = 0; i < n-1; i++) { var A = j*n + i, B = A+n; X.push(A, A+1, B+1, A, B+1, B); }
    return { p: P, n: N, i: X };
  }
  /* perfil libre [r,z] con normales calculadas */
  function perfil(pts) {
    var o = [], i;
    for (i = 0; i < pts.length; i++) {
      var a = pts[Math.max(0, i-1)], b = pts[Math.min(pts.length-1, i+1)], tr = b[0]-a[0], tz = b[1]-a[1], l = Math.hypot(tr, tz) || 1;
      o.push([pts[i][0], pts[i][1], tz/l, -tr/l]);
    }
    return o;
  }

  /* ---------- materiales: color lineal, metal, rugosidad, oclusión ---------- */
  var MAT = {
    ceram: [0.018, 0.018, 0.02, 0, 0.30, 1],     /* cerámica negra satinada */
    mate:  [0.012, 0.012, 0.013, 0, 0.62, .8],   /* fondo empotrado */
    metal: [0.62, 0.63, 0.66, 1, 0.22, 1],       /* metal oscuro pulido (cromo ahumado) */
    alu:   [0.80, 0.80, 0.80, 1, 0.42, 1],       /* aluminio cepillado */
    gris:  [0.42, 0.42, 0.43, 0, 0.36, 1]        /* acento gris claro */
  };

  /* ---------- modelos (unidades: el objeto cabe en un radio ~1) ---------- */
  function diana() {
    var p = [], k;
    p.push({ g: torno(secc(0, 1, .26, .07)), m: 'ceram' });
    p.push({ g: torno(secc(.80, .86, .05, .02)), m: 'gris', t: T(0, 0, .13) });
    p.push({ g: torno(secc(.52, .60, .05, .02)), m: 'ceram', t: T(0, 0, .15) });
    p.push({ g: torno(secc(.28, .33, .05, .02)), m: 'gris', t: T(0, 0, .13) });
    p.push({ g: torno(perfil([[0, .1], [.05, .098], [.09, .09], [.125, .075], [.15, .055], [.168, .03], [.175, 0]]), 48), m: 'metal', t: T(0, 0, .13) });
    /* dardo: punta metálica, cuerpo de aluminio, aletas negras; se clava con su eje apuntando a la cámara (inclinado) */
    var dardo = [];
    dardo.push({ g: torno(perfil([[0, 0], [.035, .12], [.045, .2]]), 24), m: 'metal' });
    dardo.push({ g: torno(secc(0, .07, .5, .03), 24), m: 'alu', t: T(0, 0, .45) });
    dardo.push({ g: torno(secc(0, .035, .3, .015), 16), m: 'metal', t: T(0, 0, .85) });
    for (k = 0; k < 4; k++) dardo.push({ g: rbox(.18, .016, .24, .008, 3), m: 'ceram', t: M(RZ(k*PI/2 + PI/4), T(.13, 0, 1.0)) });
    dardo.forEach(function (q) { q.dardo = 1; p.push(q); });
    return { partes: p, vida: function (q, t, e) {
      if (!q.dardo) return null;
      /* entrada: 0..0.5 s; vibración amortiguada; repite la vibración cada 9 s */
      var u = t - e.t0, vib = 0, pos = 1;
      if (u < .5) pos = ease(u/.5);
      var w = (u > .5 ? (u - .5) % 9 : 0);
      if (u > .5) vib = Math.exp(-w*4.5) * Math.sin(w*34) * .12;
      var lej = (1 - pos);
      return M(T(.05 + lej*1.4, .06 + lej*1.1, .12 + lej*2.2), RY(.42 + vib), RX(-.5 + vib*.6));
    } };
  }
  function reloj() {
    var p = [], k;
    p.push({ g: torno(secc(.80, 1, .40, .09)), m: 'ceram' });
    p.push({ g: torno(secc(0, .82, .14, .03)), m: 'mate', t: T(0, 0, -.06) });
    p.push({ g: torno(secc(.84, .90, .04, .015)), m: 'metal', t: T(0, 0, .2) });
    for (k = 0; k < 12; k++) {
      var q = k % 3 === 0;
      p.push({ g: rbox(q ? .06 : .035, q ? .16 : .09, .04, .015, 3), m: q ? 'metal' : 'gris', t: M(RZ(-k*PI/6), T(0, .66 - (q ? .03 : 0), .03)) });
    }
    p.push({ g: rbox(.11, .5, .05, .04, 4), m: 'metal', mano: 'h', t: T(0, .19, 0) });
    p.push({ g: rbox(.08, .7, .05, .03, 4), m: 'metal', mano: 'm', t: T(0, .29, 0) });
    p.push({ g: rbox(.025, .86, .02, .01, 3), m: 'gris', mano: 's', t: T(0, .26, 0) });
    p.push({ g: torno(perfil([[0, .07], [.05, .065], [.08, .04], [.09, 0]]), 32), m: 'metal', t: T(0, 0, .1) });
    /* corona */
    p.push({ g: torno(secc(0, .11, .14, .03), 32), m: 'metal', t: M(T(0, 1.06, 0), RX(PI/2)) });
    p.push({ g: rbox(.1, .08, .1, .03, 3), m: 'ceram', t: T(0, .98, 0) });
    return { partes: p, vida: function (q, t) {
      if (!q.mano) return null;
      var s = t + 8*60 + 10*3600 + 30, a;                     /* parte a las 10:08:30 */
      if (q.mano === 's') a = (s % 60) / 60;
      else if (q.mano === 'm') a = (s % 3600) / 3600;
      else a = (s % 43200) / 43200;
      var z = q.mano === 'h' ? .02 : q.mano === 'm' ? .06 : .1;
      return M(T(0, 0, z), RZ(-a*2*PI));
    } };
  }
  function documento() {
    var p = [], k, W = [.92, .74, .84, .56];
    p.push({ g: rbox(1.36, 1.8, .2, .1, 6), m: 'ceram' });
    /* esquina de metal plegada */
    p.push({ g: rbox(.56, .2, .14, .07, 5), m: 'metal', t: T(0, .86, .1) });
    
    for (k = 0; k < 4; k++) p.push({ g: rbox(1, .07, .04, .03, 3), m: 'gris', linea: k, w: W[k], t: T(-.48, .22 - k*.2, .11) });
    /* visto: dos trazos */
    p.push({ g: rbox(1, .09, .06, .04, 3), m: 'metal', visto: 0, t: M(T(.14, -.66, .12), RZ(-PI/4 - .05)) });
    p.push({ g: rbox(1, .09, .06, .04, 3), m: 'metal', visto: 1, t: M(T(.14, -.66, .12), RZ(PI/3.4)) });
    return { partes: p, vida: function (q, t, e) {
      var u = (t - e.t0) % 9, f;
      if (q.linea !== undefined) {
        f = eio((u - .3 - q.linea*.38) / .55);
        if (u > 7.6) f *= 1 - eio((u - 7.6) / .7);
        f = Math.max(f, .001);
        return M(T(0, 0, 0), S(f*q.w, 1, 1), T(.5, 0, 0));      /* crece desde la izquierda */
      }
      if (q.visto !== undefined) {
        var L = q.visto ? .5 : .24, d = q.visto ? .4 : 0;
        f = eio((u - 2.1 - d) / .35);
        if (u > 7.6) f *= 1 - eio((u - 7.6) / .7);
        f = Math.max(f, .001);
        return q.visto ? M(S(f*L, 1, 1), T(.5, 0, 0)) : M(S(f*L, 1, 1), T(-.5, 0, 0));
      }
      return null;
    }, despues: true };
  }
  function controles() {
    var p = [], k, X = [-.42, 0, .42];
    p.push({ g: rbox(1.52, 1.5, .24, .12, 6), m: 'ceram' });
    for (k = 0; k < 3; k++) {
      p.push({ g: rbox(.1, 1.06, .06, .05, 4), m: 'mate', t: T(X[k], -.02, .1) });
      for (var j = 0; j < 5; j++) p.push({ g: rbox(.07, .018, .02, .009, 2), m: 'gris', t: T(X[k] + .1, -.46 + j*.22, .12) });
      p.push({ g: rbox(.3, .17, .18, .07, 5), m: 'alu', perilla: k, t: T(X[k], 0, .17) });
      p.push({ g: rbox(.22, .028, .02, .012, 2), m: 'ceram', perilla: k, t: T(X[k], 0, .265) });
    }
    return { partes: p, vida: function (q, t) {
      if (q.perilla === undefined) return null;
      var k = q.perilla, y = Math.sin(t*0.9 + k*2.1) * .3 + Math.sin(t*0.37 + k) * .08;
      return T(0, y, 0);
    } };
  }
  var MODELOS = { entregables: diana, plazos: reloj, reportes: documento, ajustes: controles };

  /* ---------- sombreado ---------- */
  var VS = 'attribute vec3 p;attribute vec3 n;uniform mat4 uM,uP;varying vec3 vN,vP;varying float vZ;' +
    'void main(){vec4 w=uM*vec4(p,1.);vP=w.xyz;vN=mat3(uM)*n;vZ=p.z;gl_Position=uP*w;}';
  var FS = 'precision highp float;varying vec3 vN,vP;varying float vZ;uniform vec3 uC;uniform vec3 uR;' +
    /* uR: metal, rugosidad, oclusión */
    'float caja(vec3 r,vec3 c,vec2 t,float w){vec3 u=normalize(cross(c,vec3(0.,1.,0.)+vec3(.0001)));vec3 v=cross(u,c);float z=dot(r,c);' +
    'vec2 q=vec2(dot(r,u),dot(r,v))/max(z,.05);vec2 d=abs(q)-t;float e=length(max(d,0.))+min(max(d.x,d.y),0.);return smoothstep(w,-w,e)*step(0.,z);}' +
    'vec3 env(vec3 r,float g){float w=.04+g*.55;vec3 c=mix(vec3(.010),vec3(.11),smoothstep(-.5,1.,r.y));' +
    'c+=vec3(4.2)*caja(r,normalize(vec3(-.55,.6,.58)),vec2(.42,.3),w);' +
    'c+=vec3(1.5)*caja(r,normalize(vec3(.85,.15,.45)),vec2(.07,.9),w*.8);' +
    'c+=vec3(.7)*caja(r,normalize(vec3(.2,-.25,1.)),vec2(.9,.12),w);' +
    'c+=vec3(2.2)*smoothstep(.62,.98,r.y)*smoothstep(-.2,.3,r.z);return c;}' +
    'void main(){vec3 N=normalize(vN);vec3 V=normalize(vec3(0.,0.,10.)-vP);vec3 R=reflect(-V,N);' +
    'float nv=clamp(dot(N,V),0.,1.),m=uR.x,g=uR.y;vec3 F0=mix(vec3(.05),uC,m);vec3 F=F0+(1.-F0)*pow(1.-nv,5.)*(1.-g*.7);' +
    'vec3 L=normalize(vec3(-.5,.75,.6));float ld=clamp(dot(N,L),0.,1.);float am=mix(.35,1.,N.y*.5+.5);' +
    'vec3 dif=uC*(1.-m)*(ld*1.6+am*.5);vec3 sp=env(R,g)*F*(1.15-g*.5);' +
    'float ao=uR.z*mix(.55,1.,smoothstep(-.25,.2,vZ));vec3 c=(dif+sp)*ao;' +
    'c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);gl_FragColor=vec4(pow(clamp(c,0.,1.),vec3(1./2.2)),1.);}';

  window.G3D = function (lista, op) {
    op = op || {};
    var cv = document.createElement('canvas'), gl;
    try { gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'low-power' }); } catch (e) {}
    if (!gl) return { ok: false };
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return { ok: false };
    gl.useProgram(pr);
    var aP = gl.getAttribLocation(pr, 'p'), aN = gl.getAttribLocation(pr, 'n'),
        uM = gl.getUniformLocation(pr, 'uM'), uP = gl.getUniformLocation(pr, 'uP'), uC = gl.getUniformLocation(pr, 'uC'), uR = gl.getUniformLocation(pr, 'uR');
    gl.enableVertexAttribArray(aP); gl.enableVertexAttribArray(aN); gl.enable(gl.DEPTH_TEST);
    var u16 = true;
    function subir(g) {
      var b = { pb: gl.createBuffer(), nb: gl.createBuffer(), ib: gl.createBuffer(), c: g.i.length };
      gl.bindBuffer(gl.ARRAY_BUFFER, b.pb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g.p), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.nb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g.n), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(g.i), gl.STATIC_DRAW);
      return b;
    }
    /* proyección: perspectiva suave (cámara a 10 u, campo ~15°) */
    function persp(asp) { var f = 1 / Math.tan(.13), nr = 6, fr = 14; return [f/asp,0,0,0, 0,f,0,0, 0,0,(fr+nr)/(nr-fr),-1, 0,0,2*fr*nr/(nr-fr),0]; }
    var VIEW = T(0, 0, -10), PROJ = persp(1);

    var items = lista.map(function (el, k) {
      var n = el.getAttribute('data-g3d'), fab = MODELOS[n]; if (!fab) return null;
      var mo = fab();
      mo.partes.forEach(function (q) { q.b = subir(q.g); q.g = null; q.t = q.t || I(); });
      var c2 = document.createElement('canvas'); c2.className = 'g3d__cv'; c2.setAttribute('aria-hidden', 'true');
      el.insertBefore(c2, el.firstChild);
      return { el: el, n: n, mo: mo, cv: c2, x: c2.getContext('2d'), k: k, t0: -1, ry: 0, rx: 0, ty: 0, tx: 0, on: false, px: 0 };
    }).filter(Boolean);

    function dibujarObjeto(it, t, yaw, pitch) {
      var base = M(VIEW, T(0, .08, 0), RX(pitch), RY(yaw), S(1.06, 1.06, 1.06));
      gl.uniformMatrix4fv(uP, false, PROJ);
      it.mo.partes.forEach(function (q) {
        var v = it.mo.vida ? it.mo.vida(q, t, it) : null, mm;
        if (v) mm = it.mo.despues ? mul(base, mul(q.t, v)) : mul(base, mul(v, q.t)); else mm = mul(base, q.t);
        var mt = MAT[q.m];
        gl.uniformMatrix4fv(uM, false, mm); gl.uniform3f(uC, mt[0], mt[1], mt[2]); gl.uniform3f(uR, mt[3], mt[4], mt[5]);
        gl.bindBuffer(gl.ARRAY_BUFFER, q.b.pb); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, q.b.nb); gl.vertexAttribPointer(aN, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, q.b.ib); gl.drawElements(gl.TRIANGLES, q.b.c, gl.UNSIGNED_SHORT, 0);
      });
    }
    function sombra(x, W, Hh, yaw) {
      /* sombra de contacto: elipse con gradiente radial (suave, sin filtros), más angosta al girar */
      var a = .5 + .5*Math.abs(Math.cos(yaw)), cx = W/2, cy = Hh*.925, rx = W*.34*a + W*.06, ry = Hh*.045;
      x.save(); x.translate(cx, cy); x.scale(1, ry/rx);
      var gr = x.createRadialGradient(0, 0, 0, 0, 0, rx);
      gr.addColorStop(0, 'rgba(22,22,22,.34)'); gr.addColorStop(.45, 'rgba(22,22,22,.16)'); gr.addColorStop(1, 'rgba(22,22,22,0)');
      x.fillStyle = gr; x.beginPath(); x.arc(0, 0, rx, 0, 2*PI); x.fill(); x.restore();
    }
    var tam = 0;
    function medir() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), mx = 0;
      items.forEach(function (it) {
        var w = it.cv.clientWidth || 112, px = Math.round(w * dpr);
        if (px !== it.px) { it.px = px; it.cv.width = it.cv.height = px; }
        mx = Math.max(mx, px);
      });
      if (mx !== tam) { tam = mx; cv.width = cv.height = mx; }
    }
    function pintar(it, t) {
      if (it.t0 < 0) it.t0 = t;
      var u = t - it.t0;
      it.ry += (it.ty - it.ry) * .08; it.rx += (it.tx - it.rx) * .08;
      var yaw = Math.sin(u * 2*PI / 7.5 + it.k * 1.3) * .56 + it.ry,           /* ±32° de vaivén + puntero */
          pitch = -.16 + it.rx + (op.scroll ? op.scroll(it) : 0);
      var W = it.px;
      gl.viewport(0, 0, W, W); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      dibujarObjeto(it, t, yaw, pitch);
      var x = it.x; x.clearRect(0, 0, W, W);
      sombra(x, W, W, yaw);
      x.drawImage(cv, 0, cv.height - W, W, W, 0, 0, W, W);
    }
    medir();
    var api = {
      ok: true, items: items, medir: medir,
      cuadro: function (ms) { var t = ms / 1000; items.forEach(function (it) { if (it.on && it.px) pintar(it, t); }); },
      inclinar: function (el, rx, ry) { items.forEach(function (it) { if (it.el === el) { it.tx = rx; it.ty = ry; } }); },
      ver: function (el, on) { items.forEach(function (it) { if (it.el === el) it.on = on; }); },
      quieto: function (ms) { var t = ms / 1000; items.forEach(function (it) { it.t0 = t - 4.2; it.k = 0; pintar(it, t); }); }
    };
    return api;
  };
})();
