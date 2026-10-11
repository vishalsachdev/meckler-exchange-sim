import assert from 'node:assert/strict';
import {table,simulate,DEF,POL,CTL,settings,resetSettings,changedSettings,summarize} from './run.mjs';
const baseline=table();
function finite(value){
  if(typeof value==='number')assert.ok(Number.isFinite(value),'Non-finite model output');
  else if(value&&typeof value==='object')Object.values(value).forEach(finite);
}
finite(baseline);
for(let i=1;i<=200;i++){
  const result=simulate(i*9973,DEF,true);finite(result);
  POL.forEach(p=>{assert.ok(result[p.id].partnerMinBank>=-1e-9,'Stakeholder overspent its bank');assert.ok(result[p.id].final>=0)});
}
assert.ok(table({rule:'persona'})[0].surv>table({rule:'human'})[0].surv,'Persona should make Technical-first more likely to survive');
const state=settings({rule:'agent',techLearns:0,markets:50,seed:42,payfloor:1.5,cooprise:3},true);
assert.notDeepEqual(table(state),baseline);
resetSettings(state);
assert.deepEqual(state,DEF);
assert.deepEqual(table(state),baseline,'Reset should reproduce the complete default table');
assert.deepEqual(changedSettings(state),{});
assert.deepEqual(settings(changedSettings(settings({rule:'persona',orchNoise:2,markets:50},true)),true),settings({rule:'persona',orchNoise:2,markets:50},true),'Sharing should round-trip');
assert.throws(()=>settings({payfloor:'wrong'},true));
assert.throws(()=>settings({unknown:2},true));
assert.equal(CTL.length,new Set(CTL.map(c=>c[0])).size,'Control keys must be unique');
CTL.forEach(c=>{
  assert.ok(c[0] in DEF);assert.ok(['input','moderator','modifier'].includes(c[3]));assert.ok(c[8]);
  for(const value of [c[4],c[5]])finite(simulate(9973,settings({[c[0]]:value},true),true));
});
const frozen=simulate(9973,settings({techLearns:0},true),false).tech.beliefs;
for(const d of ['T','E','TC'])for(const [type,key] of [['min','belMin'],['max','belMax'],['w','belW']])assert.equal(frozen[type][d],DEF[key+d],'Learning off must freeze beliefs');
// A cash-poor partner must conserve resources through repeated non-cash repairs.
const scarce=simulate(9973,settings({shbank0:0,income:.5,coopfloor:.2,efloor:.2,rounds:6,shCost:.3},true),true);
POL.forEach(p=>assert.ok(scarce[p.id].partnerMinBank>=-1e-9));
// No dimension can be traded away when it is an unmet return deal-breaker.
for(const overrides of [{efloor:.1,shEScale:0},{coopfloor:.1,shTCScale:0,returnTC:0},{maxshare:0}]){
  const result=simulate(9973,settings(overrides,true),true);
  POL.forEach(p=>assert.equal(result[p.id].ok,0,'A missing return dimension must prevent agreement'));
}
const triage=simulate(9973,settings({bank0:2,triage:4,x0E:0,belMinE:.2,belMinT:0,belMinTC:0},true),true);
assert.ok(triage.tech.alloc[0].E>0,'Triage must repair a known E deal-breaker');
assert.equal(triage.tech.alloc[0].T,0);
const limitedUse=simulate(9973,settings({operant:.4,x0T:20,augT:0,techLearns:0,belMinT:0,belMinE:0,belMinTC:0},true),true);
assert.equal(limitedUse.tech.waste,0,'Unusable T must not be counted as above Maximum Demanded');
assert.equal(summarize(settings({markets:50},true)).length,4);
console.log(`Checks passed: finite defaults, persona advantage, exact reset, sharing, all ${CTL.length} control endpoints, frozen learning, and stakeholder resource conservation.`);
console.table(baseline);
