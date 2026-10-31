import {defineConfig} from 'vite';

// Expose only the two local Ollama endpoints used by the chat UI.
const proxy={
  '^/api/ollama/(chat|tags)$':{
    target:'http://127.0.0.1:11434',
    changeOrigin:true,
    rewrite:(path:string)=>path.replace('/api/ollama','/api'),
  },
};
export default defineConfig({server:{proxy},preview:{proxy}});
