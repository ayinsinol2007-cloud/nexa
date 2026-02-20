// ── Symptom Data ──
const SYMPTOMS = [
  {label:'Fever',ico:'🌡️'}, {label:'Headache',ico:'🤕'}, {label:'Cough',ico:'😮‍💨'},
  {label:'Sore Throat',ico:'🗣️'}, {label:'Fatigue',ico:'😴'}, {label:'Nausea',ico:'🤢'},
  {label:'Dizziness',ico:'💫'}, {label:'Chest Pain',ico:'💔'}, {label:'Runny Nose',ico:'🤧'},
  {label:'Stress',ico:'😰'}, {label:'Body Aches',ico:'🦴'}, {label:'Vomiting',ico:'🤮'},
  {label:'Diarrhea',ico:'🚽'}, {label:'Shortness of Breath',ico:'😤'}, {label:'Rash',ico:'🔴'},
  {label:'Loss of Appetite',ico:'🍽️'},
];

let selected = new Set();
let sexVal = '';

// Build symptom grid
const grid = document.getElementById('sym-grid');
SYMPTOMS.forEach(s => {
  const btn = document.createElement('div');
  btn.className = 'sym-btn';
  btn.innerHTML = `<span class="ico">${s.ico}</span>${s.label}`;
  btn.onclick = () => {
    selected.has(s.label) ? (selected.delete(s.label), btn.classList.remove('selected')) 
                          : (selected.add(s.label), btn.classList.add('selected'));
  };
  grid.appendChild(btn);
});

// Sex selection
function selectSex(el,val){
  document.querySelectorAll('#sex-group .radio-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected'); sexVal=val;
}

// Step navigation
function goStep(n){
  if(n===2 && selected.size===0){ alert('Please select at least one symptom.'); return; }
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  if(n<=3){
    document.getElementById('s'+n).classList.add('active');
    const pct=Math.round(n/4*100);
    document.getElementById('prog').style.width=pct+'%';
    document.getElementById('step-label').textContent=`Step ${n} of 4`;
    document.getElementById('step-pct').textContent=pct+'%';
  } else {
    document.getElementById('s4').classList.add('active');
    document.getElementById('prog').style.width='100%';
    document.getElementById('step-label').textContent='Analysing…';
    document.getElementById('step-pct').textContent='100%';
    setTimeout(showResult,2000);
  }
}

// ── Diagnosis Database ──
const DB=[
  {name:'Common Cold', keywords:['Runny Nose','Cough','Sore Throat','Fatigue','Headache'], desc:'Viral upper respiratory infection.', level:'low', tip:'Rest, fluids, steam inhalation.'},
  {name:'Influenza', keywords:['Fever','Fatigue','Body Aches','Headache','Cough','Loss of Appetite'], desc:'Contagious respiratory illness.', level:'medium', tip:'Rest, hydration, monitor fever.'},
  {name:'Migraine', keywords:['Headache','Nausea','Dizziness','Fatigue'], desc:'Recurring intense headache.', level:'medium', tip:'Rest, hydration, avoid triggers.'},
  {name:'Possible Cardiac/Emergency', keywords:['Chest Pain','Shortness of Breath','Dizziness','Fatigue'], desc:'Serious condition possible.', level:'high', tip:'Seek immediate medical attention.'}
];

// Show result
function showResult(){
  const severity=parseInt(document.getElementById('severity').value);
  const syms=Array.from(selected);

  // Emergency alert
  if(selected.has('Chest Pain') && selected.has('Shortness of Breath')){
    alert('⚠ Emergency Warning: Seek immediate medical attention!');
  }

  let scored=DB.map(c=>{
    const matches=c.keywords.filter(k=>syms.includes(k)).length;
    return {...c, score: matches/c.keywords.length, matches};
  }).filter(c=>c.matches>0).sort((a,b)=>b.score-a.score).slice(0,4);

  if(scored.length===0){
    scored=[{name:'No Strong Match', desc:'Symptoms did not strongly match our database.', level:'low'}];
  }

  if(severity>=8){
    scored=scored.map(c=>({...c, level:c.level==='low'?'medium':'high'}));
  }

  const list=document.getElementById('diag-list');
  list.innerHTML='';
  const confLabel={high:'High Likelihood', medium:'Moderate', low:'Possible'};
  scored.forEach(c=>{
    const div=document.createElement('div');
    div.className=`diag-item ${c.level}`;
    div.innerHTML=`<div class="diag-name">${c.name}</div>
                     <div class="diag-desc">${c.desc}</div>
                     <div>💡 ${c.tip||''}</div>
                     <span class="conf-badge">${confLabel[c.level]}</span>`;
    list.appendChild(div);
  });

  document.getElementById('survey-card').style.display='none';
  document.getElementById('result').style.display='block';
  document.querySelector('.progress-wrap').style.display='none';
}

// Restart
function restart(){
  selected.clear(); sexVal='';
  document.querySelectorAll('.sym-btn').forEach(b=>b.classList.remove('selected'));
  document.querySelectorAll('.radio-btn').forEach(b=>b.classList.remove('selected'));
  document.getElementById('severity').value=5;
  document.getElementById('sev-val').textContent='5/10';
  document.getElementById('duration').value='';
  document.getElementById('age').value='';
  document.getElementById('notes').value='';
  document.getElementById('result').style.display='none';
  document.getElementById('survey-card').style.display='block';
  document.querySelector('.progress-wrap').style.display='block';
  goStep(1);
}