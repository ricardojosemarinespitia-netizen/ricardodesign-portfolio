// Genera css/resto.min.css = dispositivos + secciones + plataformas + casos + descuento + servicios + cookies (mismo orden que tenia index.html; cookies va al final).
// Correr tras editar cualquiera de esas hojas: node scripts/resto.mjs
// css/cookies.css se minifica aqui mismo a css/cookies.min.css (lo piden directamente las paginas internas).
import fs from 'fs'; import { createRequire } from 'module';
const esbuild = createRequire('D:/DOCUMENTOS/COWORK GENERAL/AGENTES/node_modules/')('esbuild');
const ck = esbuild.transformSync(fs.readFileSync('css/cookies.css', 'utf8'), { loader: 'css', minify: true }).code.trim();
fs.writeFileSync('css/cookies.min.css', ck); console.log('css/cookies.min.css', ck.length, 'bytes');
const f = ['dispositivos', 'secciones', 'plataformas', 'casos', 'descuento', 'servicios', 'cookies'];
const css = '/* GENERADO por scripts/resto.mjs: no editar; edita las hojas y regenera */\n' + f.map((n) => fs.readFileSync(`css/${n}.min.css`, 'utf8').trim()).join('\n');
fs.writeFileSync('css/resto.min.css', css); console.log('css/resto.min.css', css.length, 'bytes');
