// Headless harness: runs the single-file simulator's model without a browser.
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=html.split('(function(){')[1].split('// ---------- drawing')[0].replace('window.__sim={simulate,DEF,POL};','');
const {simulate,DEF,POL,CTL,settings,resetSettings,changedSettings,summarize}=new Function(js+';return{simulate,DEF,POL,CTL,settings,resetSettings,changedSettings,summarize}')();
export function table(over={},N){
  const P=settings(over,true);
  return summarize(P,N??P.markets).map(r=>({firm:r.p.name,surv:r.surv,formal:+r.ok.toFixed(2),reneg:+r.reneg.toFixed(2),reinno:+r.reinno.toFixed(1),term:r.term,bankrupt:r.bk,waste:+r.waste.toFixed(2),final:+r.fin.toFixed(1),surplus:+r.sur.toFixed(1)}));
}
export {simulate,DEF,POL,CTL,settings,resetSettings,changedSettings,summarize};
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const scen=JSON.parse(process.argv[2]||'{}');console.log(JSON.stringify(scen));console.table(table(scen));
}
