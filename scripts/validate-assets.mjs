import fs from 'node:fs';
import path from 'node:path';
const files=['public/manifest.webmanifest','public/sw.js','public/icons/icon-192.svg','public/icons/icon-512.svg','public/data/manifest.json'];
const missing=files.filter(f=>!fs.existsSync(path.resolve(f)));
if(missing.length){console.error('Missing required assets:',missing.join(', '));process.exit(1)}
try{JSON.parse(fs.readFileSync('public/manifest.webmanifest','utf8'));JSON.parse(fs.readFileSync('public/data/manifest.json','utf8'))}catch(e){console.error('Invalid manifest JSON:',e.message);process.exit(1)}
for(const f of ['public/icons/icon-192.svg','public/icons/icon-512.svg'])if(!fs.readFileSync(f,'utf8').includes('<svg')){console.error(`Invalid SVG: ${f}`);process.exit(1)}
console.log('Asset validation passed: manifest, service worker and SVG icons are present.');
