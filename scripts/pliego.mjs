// Minifica css/pliego.css y lo anexa (o reemplaza) al final de css/secciones.min.css entre /*pliego2:ini*/ y /*pliego2:fin*/; luego regenera resto.min.css.
// Uso: node scripts/pliego.mjs  (requiere esbuild; ruta de herramientas del estudio por defecto)
import fs from 'fs';import {createRequire} from 'module';import {execSync} from 'child_process';
const req=createRequire(process.env.HERR||'D:/DOCUMENTOS/COWORK GENERAL/AGENTE WEB/herramientas/package.json');
const {transformSync}=req('esbuild');
const min=transformSync(fs.readFileSync('css/pliego.css','utf8'),{loader:'css',minify:true}).code.trim();
let s=fs.readFileSync('css/secciones.min.css','utf8');
s=s.replace(/\n?\/\*pliego2:ini\*\/[\s\S]*?\/\*pliego2:fin\*\//,'');
s=s.trimEnd()+'\n/*pliego2:ini*/'+min+'/*pliego2:fin*/\n';
fs.writeFileSync('css/secciones.min.css',s);console.log('pliego',min.length,'bytes');
execSync('node scripts/resto.mjs',{stdio:'inherit'});
