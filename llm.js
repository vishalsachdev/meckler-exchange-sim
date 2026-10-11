// LLM negotiation lab: an LLM plays the stakeholder (Stages 3-4) and another call plays the focal firm (Stage 6)
// for a package the viewer sets, looping through renegotiation and reinnovation until both accept or one quits.
// Runs only inside a claude.ai artifact viewer (the `sample` capability, on the viewer's own Claude account).
// Everywhere else the panel explains where the live version runs.
(function(){
const LIVE_URL='https://claude.ai/artifact/XGjZvvkpAaQAfEThYYV7fY';
const wrap=document.querySelector('.wrap');if(!wrap)return;
const host=document.createElement('section');host.className='panel';host.id='llm-lab';
host.innerHTML=`
<h2>LLM negotiation lab</h2>
<p class="note">The paper treats Stage 3 valuation and Stage 6 judgment as less than rational. Here a language model plays the stakeholder and another call plays the focal firm, for one package you set. They loop through renegotiation (Stages 4–5) and reinnovation (Stages 1–6) until both accept or one walks away. Next to each round is what the rule-based human evaluator in the simulator would decide, so you can see where the two disagree.</p>
<div class="llm-grid">
  <div class="llm-col">
    <h3>Firm's stand-alone package (utility, 0–1)</h3>
    ${[['T','Technical utility',.55],['E','Emotional utility',.20],['TC','Transaction-cost utility',.15]].map(([k,l,v])=>`<div class="ctl"><label for="llm-${k}">${l}<output id="llm-${k}-o">${v.toFixed(2)}</output></label><input type="range" id="llm-${k}" min="0" max="1" step="0.01" value="${v}"></div>`).join('')}
    <div class="ctl"><label for="llm-ib">Installed base<output id="llm-ib-o">0.40</output></label><input type="range" id="llm-ib" min="0" max="1" step="0.05" value="0.4"></div>
    <div class="ctl"><label for="llm-budget">Firm reinnovation budget per round<output id="llm-budget-o">0.10</output></label><input type="range" id="llm-budget" min="0" max="0.3" step="0.01" value="0.1"><small>Most total utility the firm can add across dimensions between rounds.</small></div>
  </div>
  <div class="llm-col">
    <h3>Stakeholder</h3>
    <div class="ctl"><label for="llm-who">Who evaluates</label>
      <select id="llm-who">
        <option value="human">A human buyer (screens on floors, then trades off)</option>
        <option value="persona">An AI persona simulating that buyer</option>
        <option value="agent">An AI agent buying under a principal's brief</option>
      </select></div>
    <div class="ctl"><label for="llm-ctx">Context (value-in-context)</label>
      <textarea id="llm-ctx" rows="3">Mid-size engineering firm buying design software. Budget is tight this quarter; the team hates long onboarding.</textarea></div>
    <div class="ctl"><label for="llm-floors">Stakeholder floors T / E / TC</label><input id="llm-floors" value="0.35 / 0.10 / 0.12" inputmode="decimal"></div>
    <div class="ctl"><label for="llm-ceil">Maximum demanded T / E / TC</label><input id="llm-ceil" value="0.65 / 0.45 / 0.40" inputmode="decimal"></div>
    <div class="ctl"><label for="llm-alt">Market alternatives<output id="llm-alt-o">some</output></label>
      <select id="llm-alt"><option value="none">none</option><option value="some" selected>some</option><option value="many">many</option></select></div>
  </div>
  <div class="llm-col">
    <h3>Firm's floors (Stage 6)</h3>
    <div class="ctl"><label for="llm-pay">Minimum payment (resource units)<output id="llm-pay-o">0.80</output></label><input type="range" id="llm-pay" min="0.2" max="2" step="0.05" value="0.8"></div>
    <div class="ctl"><label for="llm-coop">Minimum cooperation (TC from stakeholder, 0–1)<output id="llm-coop-o">0.05</output></label><input type="range" id="llm-coop" min="0" max="0.3" step="0.01" value="0.05"></div>
    <div class="ctl"><label for="llm-rounds">Maximum rounds<output id="llm-rounds-o">5</output></label><input type="range" id="llm-rounds" min="1" max="8" step="1" value="5"></div>
    <div class="btnrow"><button class="btn" id="llm-run">Run LLM negotiation</button><button class="btn" id="llm-stop" hidden>Stop</button></div>
    <small id="llm-status" class="note"></small>
  </div>
</div>
<ol class="llm-log" id="llm-log" aria-live="polite"></ol>`;
const before=document.querySelector('details.doc');if(before&&before.parentNode)before.parentNode.insertBefore(host,before);else wrap.appendChild(host);
const st=document.createElement('style');st.textContent=`
.llm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
@media (max-width:980px){.llm-grid{grid-template-columns:minmax(0,1fr)}}
.llm-col{display:flex;flex-direction:column;gap:12px;min-width:0}
#llm-lab select,#llm-lab textarea,#llm-lab input:not([type]){font:inherit;font-size:14px;color:var(--ink);background:var(--bg);border:1px solid var(--rule);border-radius:6px;padding:6px 8px;width:100%}
.llm-log{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}
.llm-log li{border:1px solid var(--rule);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;font-size:14.5px;min-width:0}
.llm-log .who{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.llm-log .nums{font-family:var(--mono);font-size:12.5px;color:var(--ink);overflow-wrap:anywhere}
.llm-log .rule{font-family:var(--mono);font-size:12px;color:var(--muted)}
.llm-log .agree{color:var(--ok)}.llm-log .disagree{color:var(--bad)}`;
document.head.appendChild(st);

const $=id=>document.getElementById(id);
['T','E','TC','ib','budget','pay','coop','rounds'].forEach(k=>{const el=$('llm-'+k),o=$('llm-'+k+'-o');el.addEventListener('input',()=>o.textContent=k==='rounds'?el.value:(+el.value).toFixed(2))});
$('llm-alt').addEventListener('change',e=>$('llm-alt-o').textContent=e.target.value);
const triple=s=>{const v=s.split(/[\/,\s]+/).filter(Boolean).map(Number);return{T:v[0]||0,E:v[1]||0,TC:v[2]||0}};
const r2=v=>(+v).toFixed(2);
const status=t=>$('llm-status').textContent=t;
const log=$('llm-log');
function add(who,body,nums,rule,cls){const li=document.createElement('li');
  li.innerHTML=`<span class="who"></span><span class="body"></span>${nums?'<span class="nums"></span>':''}${rule?'<span class="rule"></span>':''}`;
  li.querySelector('.who').textContent=who;li.querySelector('.body').textContent=body;
  if(nums)li.querySelector('.nums').textContent=nums;
  if(rule){const r=li.querySelector('.rule');r.textContent=rule;if(cls)r.classList.add(cls)}
  log.appendChild(li);return li}

// The simulator's rule-based human evaluator, applied to the same numbers (no perception noise).
function ruleVerdict(pkg,floors,ceil){
  if(pkg.TC<0.03)return{pass:false,why:'friction abort'};
  const broke=['T','E','TC'].filter(d=>pkg[d]<floors[d]);
  if(broke.length)return{pass:false,why:'deal-breaker: '+broke.join(', ')};
  const V=['T','E','TC'].reduce((s,d)=>s+Math.min(pkg[d],ceil[d]),0),fs=floors.T+floors.E+floors.TC;
  return V>=fs?{pass:true,why:'passes, value '+r2(V)}:{pass:false,why:'total below floors'};
}

const WHO={
  human:'You are a human buyer. You screen first: if any dimension falls below your floor you reject, even if other dimensions are strong. Above the floors you trade dimensions off. Gut feel matters; friction can make you walk away early.',
  persona:'You are an AI language model asked to simulate a typical human buyer in this context. Answer as that simulated buyer.',
  agent:'You are an AI purchasing agent acting for a principal. Your brief: meet the technical and transaction-cost floors as hard constraints; emotional appeal is not in the brief and earns little weight; minimize payment.'};

function stakeholderPrompt(s,pkg,history,demand){
  return `${WHO[s.who]}

Context: ${s.ctx}
Market alternatives available to you: ${s.alt}.
Your Minimum Necessary floors (utility 0-1): technical ${s.floors.T}, emotional ${s.floors.E}, transaction-cost ${s.floors.TC}.
Your Maximum Demanded levels (utility above these is worth nothing extra): technical ${s.ceil.T}, emotional ${s.ceil.E}, transaction-cost ${s.ceil.TC}.
Your resources: you can pay up to 1.6 resource units per unit of total value you assign, and you must keep some surplus for yourself.

The firm offers this package after network effects (utility 0-1): technical ${r2(pkg.T)}, emotional ${r2(pkg.E)}, transaction-cost ${r2(pkg.TC)}.
${history.length?'Negotiation so far:\n'+history.join('\n'):''}
${demand?'The firm just told you: '+demand:''}

Decide as this buyer. Return JSON only:
{"assigned_value":{"T":number,"E":number,"TC":number},"deal_breakers":[subset of "T","E","TC"],"decision":"offer"|"reject","offer":{"payment":number,"advocacy":number,"cooperation":number},"rationale":"one or two sentences in the buyer's voice"}
advocacy and cooperation are the emotional and transaction-cost utility (0-1) you give back to the firm (endorsement, smooth payment, data sharing). If you reject, set the offer fields to 0.`;
}
function firmPrompt(f,offer,pkg,round,maxRounds,history){
  return `You are the product team of an economizing firm judging a stakeholder's return offer (Stage 6 of an exchange model).
Your Minimum Necessary floors: payment at least ${f.pay} resource units; cooperation (transaction-cost utility from the stakeholder) at least ${f.coop}.
Your current package: technical ${r2(pkg.T)}, emotional ${r2(pkg.E)}, transaction-cost ${r2(pkg.TC)}. Between rounds you can add at most ${f.budget} total utility across dimensions (reinnovation), and every addition costs you.
Round ${round} of at most ${maxRounds}.
${history.length?'Negotiation so far:\n'+history.join('\n'):''}
The stakeholder offers: payment ${r2(offer.payment)}, advocacy ${r2(offer.advocacy)}, cooperation ${r2(offer.cooperation)}.

Judge the offer and choose one action. Return JSON only:
{"judgement":"great"|"ok"|"not good enough","action":"formalize"|"renegotiate"|"reinnovate"|"terminate","message_to_stakeholder":"what you tell them, one sentence","reinnovation":{"T":number,"E":number,"TC":number},"rationale":"one or two sentences"}
Use reinnovate when your package itself must change to earn a better offer; put the utility you add per dimension in reinnovation (sum at most ${f.budget}); otherwise use zeros.`;
}

let ctl=null;
async function run(sample){
  log.textContent='';
  const s={who:$('llm-who').value,ctx:$('llm-ctx').value.slice(0,600),alt:$('llm-alt').value,floors:triple($('llm-floors').value),ceil:triple($('llm-ceil').value)};
  const f={pay:+$('llm-pay').value,coop:+$('llm-coop').value,budget:+$('llm-budget').value};
  const maxR=+$('llm-rounds').value,ib=+$('llm-ib').value;
  let pkg={T:+$('llm-T').value,E:+$('llm-E').value,TC:+$('llm-TC').value+0.15*ib};
  const hist=[];let demand='';
  ctl=new AbortController();$('llm-run').disabled=true;$('llm-stop').hidden=false;
  try{
    for(let round=1;round<=maxR;round++){
      status(`Round ${round}: the stakeholder is valuing the package...`);
      const rv=ruleVerdict(pkg,s.floors,s.ceil);
      const sh=await sample.json(stakeholderPrompt(s,pkg,hist,demand),{signal:ctl.signal,modelTier:'quick',cache:false});
      const off=sh.offer||{payment:0,advocacy:0,cooperation:0};
      const llmPass=sh.decision==='offer';
      add(`Round ${round} · Stage 3–4 · stakeholder`,sh.rationale||'',
        `package T ${r2(pkg.T)} E ${r2(pkg.E)} TC ${r2(pkg.TC)} → value T ${r2(sh.assigned_value?.T??0)} E ${r2(sh.assigned_value?.E??0)} TC ${r2(sh.assigned_value?.TC??0)}; ${llmPass?`offers pay ${r2(off.payment)}, advocacy ${r2(off.advocacy)}, cooperation ${r2(off.cooperation)}`:'rejects'+(sh.deal_breakers?.length?' (deal-breaker: '+sh.deal_breakers.join(', ')+')':'')}`,
        `rule-based human evaluator: ${rv.why} — ${rv.pass===llmPass?'agrees':'disagrees'}`,rv.pass===llmPass?'agree':'disagree');
      hist.push(`Round ${round}: package T ${r2(pkg.T)} E ${r2(pkg.E)} TC ${r2(pkg.TC)}; stakeholder ${llmPass?`offered pay ${r2(off.payment)}, advocacy ${r2(off.advocacy)}, cooperation ${r2(off.cooperation)}`:'rejected'}.`);
      let action,fm={};
      if(!llmPass){action='reinnovate';fm={reinnovation:{},message_to_stakeholder:'',rationale:'The stakeholder rejected the package, so the firm must change it.'}}
      status(`Round ${round}: the firm is judging the offer...`);
      if(llmPass){fm=await sample.json(firmPrompt(f,off,pkg,round,maxR,hist),{signal:ctl.signal,modelTier:'quick',cache:false});action=fm.action}
      const ruleFirm=llmPass?(off.payment>=f.pay&&off.cooperation>=f.coop?(off.payment>=1.3*f.pay?'great':'ok'):'not good enough'):'—';
      if(llmPass)add(`Round ${round} · Stage 6 · firm`,`${fm.judgement||''} → ${action}. ${fm.message_to_stakeholder||''} ${fm.rationale||''}`.trim(),null,
        `rule-based firm: ${ruleFirm}`,(ruleFirm==='not good enough')===(fm.judgement==='not good enough')?'agree':'disagree');
      if(action==='formalize'){add('Outcome','Formalized: resources change hands and the installed base grows.');status('Done: formalized.');return}
      if(action==='terminate'){add('Outcome','Terminated: the firm walks away and absorbs its sunk costs.');status('Done: terminated.');return}
      if(action==='reinnovate'||!llmPass){
        let add_=fm.reinnovation||{};
        if(!llmPass&&!Object.keys(add_).length){ // rule fallback: spend the budget on the broken dimensions
          const br=(sh.deal_breakers&&sh.deal_breakers.length?sh.deal_breakers:['T','E','TC']);br.forEach(d=>add_[d]=f.budget/br.length)}
        let sum=['T','E','TC'].reduce((a,d)=>a+Math.max(0,+add_[d]||0),0);const k=sum>f.budget?f.budget/sum:1;
        ['T','E','TC'].forEach(d=>pkg[d]=Math.min(1,pkg[d]+Math.max(0,+add_[d]||0)*k));
        demand='';hist.push(`Firm reinnovated: package is now T ${r2(pkg.T)} E ${r2(pkg.E)} TC ${r2(pkg.TC)}.`);
      }else{demand=fm.message_to_stakeholder||'Your offer is not good enough.';hist.push(`Firm asked to renegotiate: "${demand}"`)}
    }
    add('Outcome','No agreement within the round limit.');status('Done: round limit reached.');
  }catch(e){
    const c=e&&e.code;
    status(c==='not_granted'?'Claude access was declined for this page. The rule-based simulator above still works.':
      c==='rate_limited'?'Too many requests just now. Wait a minute, then run again.':
      c==='aborted'?'Stopped.':'The model call failed ('+(c||'error')+'). Run again, or use the rule-based simulator above.');
  }finally{$('llm-run').disabled=false;$('llm-stop').hidden=true;ctl=null}
}

$('llm-stop').addEventListener('click',()=>ctl?.abort());
(async()=>{
  const sample=window.claude?.use?await window.claude.use('sample'):null;
  if(!sample){
    $('llm-run').disabled=true;
    const st=$('llm-status');st.textContent='';
    st.append('The live LLM version runs inside claude.ai, on the viewer\'s own Claude account: ');
    const a=document.createElement('a');a.href=LIVE_URL;a.textContent=LIVE_URL;a.rel='noopener';st.append(a,'. The rule-based simulator above works here.');
    return;
  }
  $('llm-run').addEventListener('click',()=>run(sample));
})();
})();
