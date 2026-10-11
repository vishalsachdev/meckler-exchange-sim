// Builds dist/artifact.html for the claude.ai artifact: same page as index.html, without the document
// skeleton (the artifact service adds its own) and with llm.js inlined.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const root=new URL('../',import.meta.url);
let html=readFileSync(new URL('index.html',root),'utf8');
const llm=readFileSync(new URL('llm.js',root),'utf8');
html=html.replace(/<!doctype html>\s*/i,'').replace(/<html[^>]*>\s*/i,'').replace(/<\/html>\s*$/i,'')
  .replace(/<head>\s*/i,'').replace(/<\/head>\s*/i,'').replace(/<body>\s*/i,'').replace(/<\/body>\s*/i,'')
  .replace(/<meta charset="utf-8">\s*/i,'').replace(/<meta name="viewport"[^>]*>\s*/i,'')
  .replace(/<script src="llm\.js"><\/script>/,'<script>\n'+llm+'\n</script>');
if(!html.includes('LLM negotiation lab'))html+='\n<script>\n'+llm+'\n</script>\n';
if(!/^<title>/.test(html.trimStart()))html=html.replace(/<title>[^<]*<\/title>\s*/,m=>'').replace(/^/,'<title>Six-Stage Exchange Simulator</title>\n');
mkdirSync(new URL('dist/',root),{recursive:true});
writeFileSync(new URL('dist/artifact.html',root),html);
console.log('dist/artifact.html',html.length,'bytes');
