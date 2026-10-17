// Minifica js/g3d.js + js/garantia.js -> js/garantia.min.js. Uso: node scripts/garantia.mjs
import fs from 'fs';import {createRequire} from 'module';
const req=createRequire(process.env.HERR||'D:/DOCUMENTOS/COWORK GENERAL/AGENTE WEB/herramientas/package.json');
const src=fs.readFileSync('js/g3d.js','utf8')+'\n'+fs.readFileSync('js/garantia.js','utf8');
const c=req('esbuild').transformSync(src,{minify:true,target:'es2017'}).code;
fs.writeFileSync('js/garantia.min.js',c);console.log('js/garantia.min.js',c.length,'bytes');
