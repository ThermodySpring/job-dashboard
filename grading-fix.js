const JOB_BASE_ALIASES={
  apply:['지원하다','신청하다','지원','신청'],
  applicant:['지원자','신청자'],
  qualification:['자격요건','자격 요건','자격','자격조건','자격 조건'],
  requirement:['요건','요구사항','요구 사항','필요조건','필요 조건'],
  deadline:['마감일','마감 기한','마감기한','기한'],
  recruit:['채용하다','모집하다','채용','모집'],
  position:['직무','직책','포지션'],
  experience:['경험','경력'],
  achievement:['성과','업적','성취'],
  responsibility:['책임','담당 업무','업무 책임'],
  collaborate:['협업하다','협력하다','협업','협력'],
  improve:['개선하다','향상시키다','향상하다','개선'],
  efficient:['효율적인','효율적','능률적인'],
  reliable:['신뢰할 수 있는','믿을 수 있는','신뢰할만한','신뢰할 만한'],
  evaluate:['평가하다','판단하다','평가'],
  conduct:['수행하다','실시하다','진행하다'],
  maintain:['유지하다','관리하다','유지'],
  resolve:['해결하다','해소하다','풀다'],
  priority:['우선순위','우선 순위','우선 사항'],
  available:['이용 가능한','사용 가능한','가능한','이용할 수 있는']
};

function jbNorm(v){
  return String(v||'').toLowerCase().normalize('NFKC')
    .replace(/[\s\-_.·,;:!?()[\]{}'"“”‘’]/g,'').trim();
}
function jbSplit(v){
  return String(v||'').split(/\s*(?:\/|,|;|·|\||\n)\s*/).map(x=>x.trim()).filter(Boolean);
}
function jbLevenshtein(a,b){
  a=jbNorm(a); b=jbNorm(b);
  if(!a)return b.length; if(!b)return a.length;
  const d=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
    let prev=d[0]; d[0]=i;
    for(let j=1;j<=b.length;j++){
      const tmp=d[j];
      d[j]=Math.min(d[j]+1,d[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));
      prev=tmp;
    }
  }
  return d[b.length];
}
function jbSimilarity(a,b){
  const x=jbNorm(a),y=jbNorm(b);
  if(!x||!y)return 0;
  return 1-jbLevenshtein(x,y)/Math.max(x.length,y.length);
}
function jbAccepted(item){
  let list=jbSplit(item.a);
  if(q && q.dir==='ek') list=list.concat(JOB_BASE_ALIASES[String(item.word||'').toLowerCase()]||[]);
  return [...new Set(list.filter(Boolean))];
}
function jbJudge(user,accepted,dir){
  const u=jbNorm(user);
  if(!u)return 'wrong';
  if(accepted.some(a=>jbNorm(a)===u))return 'correct';
  if(dir==='ek'){
    if(accepted.some(a=>{const n=jbNorm(a);return Math.min(n.length,u.length)>=2&&(n.includes(u)||u.includes(n));}))return 'review';
    const up=String(user).split(/[\s,/;·]+/).filter(Boolean);
    const ap=accepted.flatMap(a=>String(a).split(/[\s,/;·]+/)).filter(Boolean);
    if(up.some(p=>ap.some(a=>jbNorm(a)===jbNorm(p)&&jbNorm(p).length>=2)))return 'review';
  }
  if(accepted.some(a=>jbSimilarity(user,a)>=(dir==='ke'?0.84:0.78)))return 'review';
  return 'wrong';
}

window.start=function(){
  const n=Math.min(+$(`#cnt`).value,s.words.length);
  const d=$('#dir').value;
  const a=[...s.words].sort(()=>Math.random()-.5).slice(0,n);
  q={dir:d,items:a.map(x=>({word:x.w,meaning:x.m,p:d==='ek'?x.w:x.m,a:d==='ek'?x.m:x.w}))};
  english();
};

window.grade=function(){
  let correct=0,wrong=[];
  q.items.forEach((x,i)=>{
    const user=$('#a'+i).value.trim();
    const accepted=jbAccepted(x);
    const status=jbJudge(user,accepted,q.dir);
    let ok=status==='correct';
    if(status==='review'){
      ok=confirm(`이 답을 정답으로 인정할까요?\n\n문제: ${x.p}\n내 답: ${user||'(미입력)'}\n허용 답: ${accepted.join(' / ')}`);
    }
    if(ok) correct++;
    else wrong.push({p:x.p,a:accepted.join(' / '),y:user});
    const el=$('#r'+i);
    if(el) el.innerHTML=ok
      ? '<span style="color:var(--ok)">✓ 정답</span>'
      : `<span style="color:var(--bad)">✕ 허용 답: ${E(accepted.join(' / '))}</span>`;
  });
  const r={id:U(),date:D(),score:Math.round(correct/q.items.length*100),correct,total:q.items.length,wrong};
  s.quiz.unshift(r); q=null; save(); toast('채점 완료 · '+r.score+'점');
};

window.wordsP=function(){
  return `<div class="grid g2"><div class="card"><h2>단어 추가</h2><div class="hint" style="background:#f7f8fc;border:1px solid var(--line);padding:12px;border-radius:12px;font-size:11px;color:var(--muted);line-height:1.7">뜻이 여러 개면 <b>/</b> 또는 쉼표로 같이 적으세요.<br>예: <b>지원하다 / 신청하다</b></div><br><div class="field"><label>영단어</label><input id="nw"></div><div class="field"><label>뜻 · 허용 답안</label><input id="nm" placeholder="지원하다 / 신청하다"></div><button class="btn primary" onclick="addW()">추가</button><div class="section"><h2>여러 개 추가</h2></div><textarea id="bulk" placeholder="deadline = 마감일 / 마감 기한\nreliable = 신뢰할 수 있는 / 믿을 수 있는"></textarea><button class="btn soft" onclick="bulk()">한꺼번에 추가</button></div><div class="card"><h2>내 단어장 <span class="badge">${s.words.length}</span></h2>${s.words.map(x=>`<div class="word"><b>${E(x.w)}</b><span class="sub">${E(x.m)}</span><div><button class="btn soft" onclick="editW('${x.id}')">수정</button> <button class="btn danger" onclick="delW('${x.id}')">삭제</button></div></div>`).join('')}</div></div>`;
};

window.editW=function(id){
  const w=s.words.find(x=>x.id===id); if(!w)return;
  const v=prompt('허용할 뜻을 / 로 구분해서 수정하세요.',w.m);
  if(v!==null&&v.trim()){w.m=v.trim();save();}
};
