// Headless harness: runs the simulator's model code from index.html without a browser.
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=html.split('(function(){')[1].split('// ---------- drawing')[0].replace('window.__sim={simulate,DEF,POL};','');
const {simulate,DEF,POL}=new Function(js+';return{simulate,DEF,POL}')();
export function table(over={},N=200){
  const P={...DEF,...over};const agg={};POL.forEach(p=>agg[p.id]={surv:0,ok:0,per:0,reneg:0,reinno:0,term:0,bk:0,waste:0,spend:0,fin:0,sur:0});
  for(let s=1;s<=N;s++){const r=simulate(s*9973,P,false);POL.forEach(p=>{const a=agg[p.id],q=r[p.id];a.surv+=q.alive;a.ok+=q.ok;a.per+=q.periods;a.reneg+=q.reneg;a.reinno+=q.reinno;a.term+=q.why==='terminated';a.bk+=q.why==='bankrupt';a.waste+=q.waste;a.spend+=q.spendAll;a.fin+=q.final;a.sur+=q.surplus})}
  return POL.map(p=>{const a=agg[p.id];return{firm:p.name,surv:a.surv/N,formal:+(a.ok/a.per).toFixed(2),reneg:+(a.reneg/Math.max(1,a.ok)).toFixed(2),reinno:+(a.reinno/N).toFixed(1),term:a.term/N,bankrupt:a.bk/N,waste:+(a.waste/Math.max(1e-9,a.spend)).toFixed(2),final:+(a.fin/N).toFixed(1),surplus:+(a.sur/N).toFixed(1)}});
}
export {simulate,DEF,POL};
if(process.argv[1].endsWith('run.mjs')){
  const scen=JSON.parse(process.argv[2]||'{}');console.log(JSON.stringify(scen));console.table(table(scen));
}
