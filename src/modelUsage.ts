export type ModelMetrics={inputTokens?:number;outputTokens?:number;totalMs?:number;loadMs?:number;promptMs?:number;generationMs?:number;doneReason?:string};
export type UsageRecord=ModelMetrics&{id:string;model:string;at:string;status:'running'|'complete'|'stopped'|'failed';wallMs?:number};
const EVENT='nexus-model-usage-updated';
export const usageKey=(demo:boolean)=>`nexus-qwen-usage-${demo?'demo':'personal'}-v1`;
export function readUsage(key:string):UsageRecord[]{try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r.id==='string'&&typeof r.model==='string'&&Number.isFinite(Date.parse(r.at))&&['running','complete','stopped','failed'].includes(r.status)):[]}catch{return []}}
export function saveUsage(key:string,record:UsageRecord){const rows=readUsage(key),index=rows.findIndex(r=>r.id===record.id);if(index>=0)rows[index]={...rows[index],...record};else rows.push(record);localStorage.setItem(key,JSON.stringify(rows));window.dispatchEvent(new Event(EVENT))}
export function clearUsage(key:string){localStorage.removeItem(key);window.dispatchEvent(new Event(EVENT))}
export function subscribeUsage(listener:()=>void){window.addEventListener(EVENT,listener);window.addEventListener('storage',listener);return()=>{window.removeEventListener(EVENT,listener);window.removeEventListener('storage',listener)}}
// All counts come from Ollama's final stream record, never from text estimates.
export function parseMetrics(part:Record<string,unknown>):ModelMetrics{
 const number=(key:string)=>typeof part[key]==='number'&&Number.isFinite(part[key])&&Number(part[key])>=0?Number(part[key]):undefined;
 const ms=(key:string)=>{const n=number(key);return n===undefined?undefined:n/1e6};
 return {inputTokens:number('prompt_eval_count'),outputTokens:number('eval_count'),totalMs:ms('total_duration'),loadMs:ms('load_duration'),promptMs:ms('prompt_eval_duration'),generationMs:ms('eval_duration'),doneReason:typeof part.done_reason==='string'?part.done_reason:undefined};
}
export const usageDay=(date:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));
