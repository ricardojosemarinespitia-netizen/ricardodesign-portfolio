// Genera css/resto.min.css = dispositivos + secciones + plataformas + casos + descuento + servicios (mismo orden que tenia index.html).
// Correr tras editar cualquiera de esas seis hojas: node scripts/resto.mjs
import fs from 'fs';
const f=['dispositivos','secciones','plataformas','casos','descuento','servicios'];
const css='/* GENERADO por scripts/resto.mjs: no editar; edita las seis hojas y regenera */\n'+f.map(n=>fs.readFileSync(`css/${n}.min.css`,'utf8').trim()).join('\n');
fs.writeFileSync('css/resto.min.css',css);console.log('css/resto.min.css',css.length,'bytes');
