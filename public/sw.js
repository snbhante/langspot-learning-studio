/* LangSpot PWA service worker. All paths are resolved relative to the registered scope. */
const CACHE_VERSION = 'langspot-v0.1.0';
const BASE_PATH = new URL('./', self.registration.scope).pathname;
const SHELL = [BASE_PATH, `${BASE_PATH}manifest.webmanifest`];
const DB_NAME = 'langspot-learning-studio';
const DB_STORE = 'shares';

function openShareDb() { return new Promise((resolve,reject)=>{ const request=indexedDB.open(DB_NAME,1); request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE,{keyPath:'id',autoIncrement:true});}; request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error); }); }
async function storeShare(formData) {
 const files=[]; for(const [field,value] of formData.entries()){if(value instanceof File && value.size>0)files.push({field,file:value});}
 const record={title:String(formData.get('name')||''),text:String(formData.get('description')||''),url:String(formData.get('link')||''),files:files.map(x=>x.file),fields:files.map(x=>x.field),receivedAt:Date.now()};
 const db=await openShareDb(); return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');const request=tx.objectStore(DB_STORE).add(record);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(SHELL).catch(()=>undefined)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('langspot-')&&k!==CACHE_VERSION).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const request=event.request;const url=new URL(request.url);if(url.origin!==self.location.origin)return;const shareTarget=new URL('share-target/',self.registration.scope);if(request.method==='POST'&&url.pathname===shareTarget.pathname){event.respondWith((async()=>{try{const id=await storeShare(await request.formData());return Response.redirect(`${shareTarget.href}?id=${encodeURIComponent(id)}`,303);}catch{return Response.redirect(`${shareTarget.href}?error=1`,303);}})());return;}if(request.method!=='GET'||request.headers.has('range'))return;event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok&&response.type==='basic'){const cache=await caches.open(CACHE_VERSION);cache.put(request,response.clone()).catch(()=>undefined);}return response;}catch{const cached=await caches.match(request);if(cached)return cached;if(request.mode==='navigate')return (await caches.match(BASE_PATH))||Response.error();return Response.error();}})());});
