// Minifica js/garantia.js -> js/garantia.min.js. Uso: node scripts/garantia.mjs
import fs from 'fs';import {createRequire} from 'module';
const req=createRequire(process.env.HERR||'D:/DOCUMENTOS/COWORK GENERAL/AGENTE WEB/herramientas/package.json');
const c=req('esbuild').transformSync(fs.readFileSync('js/garantia.js','utf8'),{minify:true,target:'es2017'}).code;
fs.writeFileSync('js/garantia.min.js',c);console.log('js/garantia.min.js',c.length,'bytes');
