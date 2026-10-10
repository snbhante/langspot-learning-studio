import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const languages=JSON.parse(fs.readFileSync('public/data/languages.json','utf8'));
test('exactly ten supported language profiles exist',()=>{assert.equal(languages.length,10);assert.equal(new Set(languages.map(x=>x.id)).size,10)});
test('every language has a 120-day roadmap and learning fields',()=>{for(const lang of languages){const d=JSON.parse(fs.readFileSync(`public/data/languages/${lang.id}.json`,'utf8'));assert.equal(d.lessons.length,120,lang.id);assert.equal(d.lessons[0].day,1);assert.equal(d.lessons[119].day,120);for(const lesson of [d.lessons[0],d.lessons[119]]){assert.ok(lesson.objectives.length);assert.ok(lesson.readingActivity);assert.ok(lesson.quiz.explanation);}}});
test('starter vocabulary contains Bengali and English meanings',()=>{for(const lang of languages){const d=JSON.parse(fs.readFileSync(`public/data/languages/${lang.id}.json`,'utf8'));assert.ok(d.vocabulary.length>=5);for(const v of d.vocabulary){assert.ok(v.text);assert.ok(v.meaningBn);assert.ok(v.meaningEn)}}});
test('content ids are unique within each dataset category',()=>{for(const lang of languages){const d=JSON.parse(fs.readFileSync(`public/data/languages/${lang.id}.json`,'utf8'));for(const k of ['lessons','vocabulary','grammar','articles'])assert.equal(new Set(d[k].map(x=>x.id)).size,d[k].length,`${lang.id}:${k}`)}});
test('Pāli and Sanskrit records preserve diacritics and script',()=>{const pi=JSON.parse(fs.readFileSync('public/data/languages/pi.json','utf8'));const sa=JSON.parse(fs.readFileSync('public/data/languages/sa.json','utf8'));assert.ok(pi.vocabulary.some(v=>v.text==='dhamma'));assert.ok(sa.vocabulary.some(v=>v.text==='धर्मः'))});
