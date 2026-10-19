// Compatibilidad del JS publicado. Uso: node scripts/compat.mjs
// 1) Minifica a ES2017 (sin lowering de import(): se usa RDCAP.modulo) js/polyfill.js, js/diag.js, js/servicios.js, js/plataformas.js, js/cookies.js.
// 2) Verifica con acorn que TODO js/*.min.js y los <script> inline de index.html parsean como ES2017 clásico
//    (objetivo: Safari/iOS 12, Chrome 64, WebView de Instagram/Facebook viejos). js/rd3d.min.js es un módulo ES que solo se importa
//    cuando RDCAP.puede3d() es cierto, así que se valida como módulo ES2022.
import fs from 'fs'; import { createRequire } from 'module';
const req = createRequire('D:/DOCUMENTOS/COWORK GENERAL/AGENTES/node_modules/');
const esbuild = req('esbuild');
const acorn = createRequire('D:/DOCUMENTOS/COWORK GENERAL/AGENTE WEB/herramientas/package.json')('acorn');
const min = (s) => esbuild.transformSync(s, { loader: 'js', minify: true, target: 'es2017' }).code;
for (const [src, out] of [['js/polyfill.js', 'js/polyfill.min.js'], ['js/diag.js', 'js/diag.min.js'], ['js/servicios.js', 'js/servicios.min.js'], ['js/plataformas.js', 'js/plataformas.min.js'], ['js/cookies.js', 'js/cookies.min.js']]) {
  if (!fs.existsSync(src)) continue;
  const c = min(fs.readFileSync(src, 'utf8')); fs.writeFileSync(out, c); console.log(out, c.length, 'B');
}
let malos = 0;
const prueba = (nombre, codigo, op) => { try { acorn.parse(codigo, op); console.log('OK  ', nombre); } catch (e) { malos++; console.log('FAIL', nombre, '::', e.message); } };
for (const f of fs.readdirSync('js').filter((n) => n.endsWith('.min.js'))) {
  const codigo = fs.readFileSync('js/' + f, 'utf8');
  if (f === 'rd3d.min.js') prueba('js/' + f + ' (módulo ES2022, solo con WebGL2)', codigo, { ecmaVersion: 2022, sourceType: 'module' });
  else prueba('js/' + f + ' (ES2017 clásico)', codigo, { ecmaVersion: 2017, sourceType: 'script' });
}
for (const f of fs.readdirSync('js/vendor')) prueba('js/vendor/' + f, fs.readFileSync('js/vendor/' + f, 'utf8'), { ecmaVersion: 2017, sourceType: 'script' });
const html = fs.readFileSync('index.html', 'utf8'); const re = /<script(?![^>]*(?:src=|type="application))[^>]*>([\s\S]*?)<\/script>/g; let m, i = 0;
while ((m = re.exec(html))) prueba('index.html <script> inline #' + (++i), m[1], { ecmaVersion: 2017, sourceType: 'script' });
if (malos) { console.error(malos + ' archivo(s) no pasan ES2017'); process.exit(1); } else console.log('Todo el JS clásico publicado parsea como ES2017.');
