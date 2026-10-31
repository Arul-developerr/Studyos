import {parseMetrics,type ModelMetrics} from './modelUsage';
export const CHAT_MODEL='qwen3:0.6b';
export type ChatMessage={id:string;role:'user'|'assistant';content:string;at:string;status?:'complete'|'stopped'|'failed'};
export async function checkModel(signal?:AbortSignal):Promise<boolean>{
  const response=await fetch('/api/ollama/tags',{signal});
  if(!response.ok)throw Error('Cannot reach local Ollama. Make sure Ollama is running, then retry.');
  const result=await response.json();
  return Array.isArray(result.models)&&result.models.some((model:{name?:string})=>model.name===CHAT_MODEL);
}
export async function streamReply(messages:{role:string;content:string}[],signal:AbortSignal,onText:(text:string)=>void,onMetrics?:(metrics:ModelMetrics)=>void){
  const response=await fetch('/api/ollama/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:CHAT_MODEL,messages,stream:true,think:false,options:{temperature:0.4,num_ctx:4096,num_predict:768},keep_alive:'5m'}),signal});
  if(!response.ok){let detail='';try{detail=(await response.json()).error||''}catch{}throw Error(detail||`Ollama request failed (${response.status}). Check the local model connection.`)}
  if(!response.body)throw Error('The model returned no response stream.');
  const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',done=false,answer='';
  const consume=(line:string)=>{if(!line.trim())return;const part=JSON.parse(line);if(part.error)throw Error(part.error);if(typeof part.message?.content==='string'){answer+=part.message.content;onText(answer)}if(part.done){done=true;onMetrics?.(parseMetrics(part))}};
  try{while(true){const chunk=await reader.read();if(chunk.done)break;buffer+=decoder.decode(chunk.value,{stream:true});const lines=buffer.split('\n');buffer=lines.pop()||'';lines.forEach(consume)}buffer+=decoder.decode();consume(buffer);if(!done)throw Error('The response ended early. Please retry.');if(!answer.trim())throw Error('The model returned an empty answer. Please retry.');return answer}finally{await reader.cancel().catch(()=>{});reader.releaseLock()}
}
