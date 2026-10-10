import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('public/manifest.webmanifest', 'utf8'));
test('PWA manifest retains the supplied feature families', () => {
  for (const key of ['lang','dir','name','short_name','description','categories','theme_color','background_color','start_url','scope','id','display','display_override','orientation','icons','shortcuts','screenshots','prefer_related_applications','related_applications','file_handlers','launch_handler','protocol_handlers','share_target']) assert.ok(key in manifest, `missing manifest field ${key}`);
});
test('manifest icon, shortcut and screenshot assets exist', () => {
  for (const icon of manifest.icons) assert.ok(fs.existsSync(`public/${icon.src}`), icon.src);
  for (const shortcut of manifest.shortcuts) { assert.ok(shortcut.url); for (const icon of shortcut.icons || []) assert.ok(fs.existsSync(`public/${icon.src}`), icon.src); }
  for (const shot of manifest.screenshots) assert.ok(fs.existsSync(`public/${shot.src}`), shot.src);
});
test('PWA target routes and service-worker share storage are present', () => {
  for (const route of ['search','research','dictionary','workspace','share-target','handle-audio-file','protocol-handler']) assert.ok(fs.existsSync(`app/${route}/page.tsx`), route);
  const sw=fs.readFileSync('public/sw.js','utf8'); assert.match(sw,/shareTarget/); assert.match(sw,/indexedDB/); assert.match(sw,/CACHE_VERSION/);
});
test('Supabase profile schema enables row-level security', () => {
  const sql=fs.readFileSync('docs/supabase/schema.sql','utf8'); assert.match(sql,/enable row level security/i); assert.match(sql,/auth\.uid\(\) = id/i); assert.match(sql,/preferences jsonb/i);
});
