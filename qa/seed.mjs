import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {chromium} from '@playwright/test';
const server=await createServer({server:{host:'127.0.0.1',port:5188,strictPort:true}});await server.listen();
let browser;
try{
 const {createDemoData}=await server.ssrLoadModule('/src/demoData.ts');
 const {quizAccuracy,validatePlan}=await server.ssrLoadModule('/src/logic.ts');
 const d=createDemoData(),done=d.sessions.filter(s=>s.done),expected=[2,3,2.5,3.5,1.5,3,.5,4,2.5,3,2,3.5,2.5,1];
 assert.equal(done.length,24);assert.equal(done.reduce((a,s)=>a+s.minutes,0),2070);
 expected.forEach((h,i)=>assert.equal(done.filter(s=>s.start.slice(0,10)===`2026-10-${17+i}`).reduce((a,s)=>a+s.minutes,0),h*60));
 ['dsa','dbms','web','apt'].forEach((id,i)=>{assert.equal(done.filter(s=>s.subjectId===id).reduce((a,s)=>a+s.minutes,0),[600,540,480,450][i]);assert.equal(quizAccuracy(d,id),[72,84,88,61][i]);assert.equal(d.subjects[i].topics.reduce((a,t)=>a+t.mastery,0)/4,[68,81,85,55][i])});
 assert.equal(d.sessions.filter(s=>['missed','incomplete'].includes(s.status)).length,5);
 assert.equal(d.tasks.length,20);assert.equal(d.quizzes.length,6);assert.equal(d.revisions.length,12);assert.equal(d.decisions.length,7);assert.equal(d.exams.length,2);
 for(const collection of [d.sessions,d.tasks,d.quizzes,d.revisions,d.decisions,d.events,d.achievements])assert.equal(new Set(collection.map(r=>r.id)).size,collection.length);
 const subjectIds=new Set(d.subjects.map(s=>s.id)),topicIds=new Set(d.subjects.flatMap(s=>s.topics.map(t=>t.id)));
 for(const r of [...d.sessions,...d.tasks,...d.quizzes,...d.revisions,...d.exams]){assert(subjectIds.has(r.subjectId));if(r.topicId)assert(topicIds.has(r.topicId))}
 for(const q of d.quizzes){assert.equal(q.correct+q.incorrect,q.total);assert.equal(q.correct/q.total*100,q.score)}
 assert.equal(d.decisions.filter(x=>x.status==='accepted').length,2);assert.equal(d.decisions.filter(x=>x.status==='rejected').length,1);
 assert.deepEqual(d.sessions.filter(s=>s.status==='planned'),d.decisions[0].after);assert(validatePlan(d.sessions));
 assert.equal(new Set(d.events.map(e=>new Date(new Date(e.at).getTime()+330*60000).toISOString().slice(0,10))).size,14);
 assert.deepEqual(createDemoData(),d);
 browser=await chromium.launch({headless:true});const page=await browser.newPage();
 const routes=['/','/signin','/onboarding','/dashboard','/planner','/agent','/tasks','/analytics','/progress','/focus','/knowledge','/memory','/exam-readiness','/digital-twin','/adaptation','/agent-history','/profile','/settings','/activity','/achievements','/resources'];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of routes){await page.goto('http://127.0.0.1:5188'+route);await page.waitForSelector('h1');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nexus-studyos-demo-v1')).sessions.filter(s=>s.done).reduce((a,s)=>a+s.minutes,0)),2070)}
 await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nexus-studyos-demo-v1')).quizzes.length),6);
 const old={...d,student:{...d.student,name:'Preserved Personal Student'},demo:undefined};await page.evaluate(old=>{localStorage.clear();localStorage.setItem('nexus-studyos-v1',JSON.stringify(old))},old);await page.goto('http://127.0.0.1:5188/settings');await page.getByRole('button',{name:/Load 14-Day Demo Data/}).click();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nexus-studyos-v1')).student.name),'Preserved Personal Student');await page.getByRole('button',{name:/Return to Personal Workspace/}).click();await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('nexus-studyos-mode')),'personal');assert.equal(errors.length,0,errors.join('\n'));
 console.log(JSON.stringify({dailyHours:expected,completedSessions:24,completedHours:34.5,subjectHours:[10,9,8,7.5],quizAccuracies:[72,84,88,61],overallQuizAccuracy:quizAccuracy(d),tasks:20,revisions:12,agentEvents:7,routes:21,persistence:'passed',personalDataPreservation:'passed',errors},null,2));
}finally{await browser?.close();await server.close()}
