import {mkdir} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from '@playwright/test';

const routes=process.env.QA_ONLY?[process.env.QA_ONLY]:['/','/signin','/onboarding','/dashboard','/planner','/agent','/tasks','/analytics','/progress','/focus','/knowledge','/memory','/exam-readiness','/digital-twin','/adaptation','/agent-history','/profile','/settings','/activity','/achievements','/resources'];
const server=await createServer({server:{host:'127.0.0.1',port:5187,strictPort:true}});
await server.listen();
let browser;
const failures=[];
let checks=0;
try{
  browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
  const context=await browser.newContext();
  const page=await context.newPage();
  page.on('pageerror',error=>failures.push(`Runtime: ${error.message}`));
  await mkdir("qa/captures",{recursive:true});
  for(const width of [1440,1280,768,390]){
    await page.setViewportSize({width,height:width===390?844:width===1440?900:width===1280?800:1024});
    for(const route of routes){
      try{
        const response=await page.goto(`http://127.0.0.1:5187${route}`,{waitUntil:'networkidle'});
        if(response?.status()!==200)throw Error(`HTTP ${response?.status()}`);
        const state=await page.evaluate(()=>({heading:!!document.querySelector('h1'),overflow:document.documentElement.scrollWidth>window.innerWidth+1,offenders:[...document.querySelectorAll("*")].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,6).map(e=>({tag:e.tagName,class:typeof e.className==="string"?e.className:"",width:Math.round(e.getBoundingClientRect().width),right:Math.round(e.getBoundingClientRect().right),html:e.outerHTML.slice(0,110)}))}));
        if(!state.heading||state.overflow)throw Error(JSON.stringify(state));
        if(width===1440)await page.screenshot({path:`qa/captures/${route.slice(1)||"landing"}.png`,fullPage:true});
        checks++;
      }catch(error){failures.push(`${width} ${route}: ${error.message}`)}
    }
  }
  await page.setViewportSize({width:1536,height:1024});
  await page.goto('http://127.0.0.1:5187/planner');
  await page.getByRole('button',{name:'Generate Plan'}).click();
  if(await page.locator('.ref-calendar-event').count()===0)failures.push('Planner: generated no calendar events');else checks++;
  await page.goto('http://127.0.0.1:5187/profile'); if(process.env.QA_SCREENSHOTS==='1')await page.screenshot({path:'qa/profile-review.png'});
  if(!await page.getByRole('heading',{name:'About Me'}).isVisible())failures.push('Profile: overview missing');else checks++;
  await page.goto('http://127.0.0.1:5187/settings'); if(process.env.QA_SCREENSHOTS==='1')await page.screenshot({path:'qa/settings-review.png'});
  if(!await page.getByRole('heading',{name:'General Settings'}).isVisible())failures.push('Settings: general panel missing');else checks++;
  await context.close();
}finally{await browser?.close();await server.close()}
console.log(JSON.stringify({checks,failures},null,2));
if(failures.length)process.exitCode=1;




