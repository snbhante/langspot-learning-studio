import fs from 'node:fs';
import path from 'node:path';
const required=['public/manifest.webmanifest','public/sw.js','public/icons/icon-192.svg','public/icons/icon-192.png','public/icons/icon-512.png','public/icons/icon-maskable-512.png','public/icons/icon-128.png','public/icons/icon-96.png','public/icons/icon-48.png','public/icons/icon-32.png','public/branding/logo.svg','public/data/manifest.json','public/screenshots/home-wide.svg','public/screenshots/settings-wide.svg','public/screenshots/home-narrow.svg'];
const missing=required.filter(f=>!fs.existsSync(path.resolve(f)));
if(missing.length){console.error('Missing required assets:',missing.join(', '));process.exit(1)}
let manifest;try{manifest=JSON.parse(fs.readFileSync('public/manifest.webmanifest','utf8'));JSON.parse(fs.readFileSync('public/data/manifest.json','utf8'))}catch(e){console.error('Invalid manifest JSON:',e.message);process.exit(1)}
for(const key of ['icons','shortcuts','screenshots','file_handlers','launch_handler','protocol_handlers','share_target'])if(!manifest[key]){console.error(`Manifest field missing: ${key}`);process.exit(1)}
for(const icon of manifest.icons){if(!fs.existsSync(path.resolve('public',icon.src))) {console.error(`Missing manifest icon: ${icon.src}`);process.exit(1)}}
for(const item of manifest.shortcuts){if(!item.url){console.error('Shortcut missing URL');process.exit(1)}for(const icon of item.icons||[])if(!fs.existsSync(path.resolve('public',icon.src))){console.error(`Missing shortcut icon: ${icon.src}`);process.exit(1)}}
for(const shot of manifest.screenshots||[])if(!fs.existsSync(path.resolve('public',shot.src))){console.error(`Missing screenshot: ${shot.src}`);process.exit(1)}
console.log(`Asset validation passed: ${manifest.icons.length} icons, ${manifest.shortcuts.length} shortcuts, ${manifest.screenshots.length} screenshots and PWA handlers present.`);
