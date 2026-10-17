// Genera css/resto.min.css = dispositivos + secciones + plataformas + casos + descuento (mismo orden que tenia index.html).
// Correr tras editar cualquiera de esas cinco hojas: node scripts/resto.mjs
import fs from 'fs';
const f=['dispositivos','secciones','plataformas','casos','descuento'];
const css='/* GENERADO por scripts/resto.mjs: no editar; edita las cinco hojas y regenera */\n'+f.map(n=>fs.readFileSync(`css/${n}.min.css`,'utf8').trim()).join('\n');
fs.writeFileSync('css/resto.min.css',css);console.log('css/resto.min.css',css.length,'bytes');
