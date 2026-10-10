import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('public/data');
const manifest = JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const languages = JSON.parse(fs.readFileSync(path.join(root,'languages.json'),'utf8'));
const errors=[];
if (languages.length !== 10) errors.push(`Expected 10 language profiles; found ${languages.length}`);
const ids=new Set();
for(const lang of languages){
 if(ids.has(lang.id)) errors.push(`Duplicate language id: ${lang.id}`); ids.add(lang.id);
 const file=path.join(root,'languages',`${lang.id}.json`);
 if(!fs.existsSync(file)){errors.push(`Missing dataset: ${file}`);continue;}
 let data;try{data=JSON.parse(fs.readFileSync(file,'utf8'))}catch(e){errors.push(`Invalid JSON ${file}: ${e.message}`);continue;}
 if(data.meta?.languageId!==lang.id) errors.push(`${file}: meta.languageId mismatch`);
 if(!Array.isArray(data.lessons)||data.lessons.length!==120) errors.push(`${file}: expected 120 lessons`);
 const lessonIds=new Set();
 for(let i=0;i<(data.lessons||[]).length;i++){
  const l=data.lessons[i];
  if(!l.id||lessonIds.has(l.id))errors.push(`${file}: missing/duplicate lesson id at day ${i+1}`);lessonIds.add(l.id);
  if(l.day!==i+1)errors.push(`${file}: expected day ${i+1}, got ${l.day}`);
  for(const key of ['objectives','newConcepts','practiceExercises'])if(!Array.isArray(l[key])||!l[key].length)errors.push(`${file}: ${l.id} missing ${key}`);
  if(!l.quiz?.options?.length||!Number.isInteger(l.quiz.answerIndex)||!l.quiz.explanation)errors.push(`${file}: invalid quiz for ${l.id}`);
 }
 for(const [kind,records] of Object.entries({vocabulary:data.vocabulary,grammar:data.grammar,articles:data.articles})){
  if(!Array.isArray(records)||records.length===0){errors.push(`${file}: missing ${kind}`);continue;}
  const set=new Set();for(const r of records){if(!r.id||set.has(r.id))errors.push(`${file}: duplicate/missing ${kind} id ${r.id}`);set.add(r.id);if(r.languageId!==lang.id)errors.push(`${file}: ${r.id} has wrong languageId`);}
 }
}
for(const id of manifest.languageIds||[])if(!ids.has(id))errors.push(`Manifest references unknown language ${id}`);
for(const rel of manifest.datasets||[])if(!fs.existsSync(path.join(root,rel)))errors.push(`Manifest dataset missing: ${rel}`);
if(errors.length){console.error(`Content validation FAILED (${errors.length} issue(s))`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log(`Content validation passed: ${languages.length} languages, ${languages.length*120} roadmap lessons, vocabulary/grammar/articles present.`);
