const JOB_BASE_CERTS=[
{id:'history',rank:1,name:'한국사능력검정 1급',target:'1급',scope:'공통 최우선',gov:'국가직 7급은 2급 이상이 응시요건',pub:'여러 공공기관에서 1·2급을 자격증 가점/서류평가에 활용',why:'공무원 필수요건 + 공기업 활용도가 겹침. 가능하면 2급이 아니라 1급으로 끝내기.'},
{id:'toeic',rank:2,name:'TOEIC',target:'850점 이상 권장',scope:'공통 최우선',gov:'국가직 7급 영어능력검정 기준 충족 필요(TOEIC 700점 이상)',pub:'기관에 따라 지원요건·서류점수·어학환산에 사용',why:'공무원과 공기업 양쪽에서 가장 넓게 먹히는 영어 스펙. 850+는 범용 목표이지 모든 기관의 공식 커트는 아님.'},
{id:'electric',rank:3,name:'전기기사',target:'취득',scope:'전기기술직 핵심',gov:'7급 과학기술직군 기사급 자격증은 5% 가산. 전기 직류 인정 자격은 공고·별표 확인',pub:'전력·에너지·시설 전기직에서 필수/가점/직무적합성으로 폭넓게 활용',why:'전기기술직을 병행한다면 공기업과 기술직 공무원을 동시에 커버하는 핵심 자격증.'},
{id:'computer',rank:4,name:'컴퓨터활용능력 1급',target:'1급',scope:'공기업 범용',gov:'현재 국가직 7급의 일반적인 공통 IT 가산점 자격증은 아님',pub:'사무·행정 중심 여러 공공기관에서 가점 또는 서류평가에 활용',why:'공무원보다 공기업 쪽 효율이 높음. 한국사·영어 다음에 빠르게 확보하기 좋음.'},
{id:'opic',rank:5,name:'OPIc / TOEIC Speaking',target:'OPIc IH 또는 동급 권장',scope:'공기업 보강',gov:'국가직 7급 영어 대체의 대표 필수시험은 TOEIC·TOEFL·TEPS·G-TELP·FLEX 계열',pub:'한수원 등 일부 기관에서 스피킹 성적 우대',why:'TOEIC을 먼저 만든 뒤 면접·공기업 우대를 함께 노리는 보강 스펙.'},
{id:'electricwork',rank:6,name:'전기공사기사',target:'선택',scope:'전기직 확장',gov:'전기직 인정 기사급이면 5% 구간이나 자격증 가산은 유리한 1개만 적용',pub:'전력·공사·시설계열 지원 폭 확대',why:'전기기사 취득 뒤 쌍기사 전략이 필요한 기관을 노릴 때 추가.'},
{id:'safety',rank:7,name:'산업안전기사 / 소방설비기사(전기)',target:'선택',scope:'시설·안전 특화',gov:'응시 직류의 가산대상 자격증에 포함되는지 별표12 확인 필요',pub:'안전·시설·발전·공항·철도 계열에서 직무별 활용',why:'지원기업을 좁힌 뒤 따는 특화 자격증. 처음부터 공통 자격보다 앞세우지 않기.'},
{id:'korean',rank:8,name:'KBS한국어 / 국어능력 / 실용글쓰기',target:'기관별',scope:'기관 특화',gov:'일반적인 국가직 7급 필수자격은 아님',pub:'일부 행정·사무 공공기관에서 가점',why:'목표기관 공고에 실제 가점이 있을 때만 취득.'}
];
const JOB_BASE_TIERS=[
{tier:'S',label:'상향지원',note:'채용난도·선호도·보상·전기기술직 매력을 종합한 상향 목표군',companies:['한국전력거래소(KPX)','인천국제공항공사','한국가스공사','한국수력원자력']},
{tier:'A',label:'핵심지원',note:'전기·에너지·인프라 직무와 궁합이 좋고 주력으로 준비할 만한 기관군',companies:['한국전력공사','발전5사(남동·남부·동서·서부·중부)','한국지역난방공사','K-water','한국도로공사','한국공항공사','LH']},
{tier:'B',label:'지원폭 확대',note:'직무·근무지·채용규모를 보고 적극 지원할 기관군',companies:['한국철도공사(코레일)','한전KPS','한국전기안전공사','한국가스안전공사','한국에너지공단']},
{tier:'C',label:'지역·직무 맞춤',note:'절대적 하위가 아니라 지역선호와 세부직무에 따라 만족도가 크게 갈리는 기관군',companies:['도시철도·교통공사','지방공기업','시설공단·도시공사','기타 에너지·환경 공공기관']}
];
const CSK='job-base-cert-status-v1';
let certState={};try{certState=JSON.parse(localStorage.getItem(CSK)||'{}')}catch{}
function certSave(id,v){certState[id]=v;localStorage.setItem(CSK,JSON.stringify(certState));renderStrategy()}
function certBadge(s){return s==='done'?'취득완료':s==='study'?'준비중':s==='hold'?'보류':'미시작'}
function ensureStrategyUI(){
 if(document.getElementById('strategy'))return;
 const nav=document.getElementById('nav');
 const settings=nav.querySelector('[data-v="settings"]');
 const b=document.createElement('button');b.dataset.v='strategy';b.innerHTML='◆ 자격증 전략';nav.insertBefore(b,settings);
 const sec=document.createElement('section');sec.id='strategy';sec.className='view';document.querySelector('main.main').appendChild(sec);
 const st=document.createElement('style');st.textContent=`.cert-top{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.cert-priority{display:grid;grid-template-columns:52px 1.1fr .9fr .9fr 140px;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)}.rank{width:36px;height:36px;border-radius:12px;background:var(--soft);color:var(--a);display:grid;place-items:center;font-weight:900}.cert-priority small,.tier-note{color:var(--muted);font-size:11px;line-height:1.6}.tier-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.tier-card{border:1px solid var(--line);border-radius:16px;padding:16px;background:#fff}.tier-letter{font-size:28px;font-weight:900;color:var(--a)}.company-chip{display:inline-block;margin:4px 4px 0 0;padding:6px 9px;border-radius:999px;background:#f4f5f9;font-size:11px}.compare{width:100%;border-collapse:collapse;font-size:12px}.compare th,.compare td{padding:11px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.compare th{color:var(--muted);font-size:10px}.strategy-note{padding:14px;border-radius:14px;background:#fff8e8;color:#755713;font-size:11px;line-height:1.7}@media(max-width:900px){.cert-top{grid-template-columns:repeat(2,1fr)}.cert-priority{grid-template-columns:42px 1fr}.cert-priority .hide-m{display:none}.tier-grid{grid-template-columns:1fr}}`;
 document.head.appendChild(st);
 b.onclick=()=>showStrategy();renderStrategy();
}
function showStrategy(){
 document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='strategy'));
 document.querySelectorAll('#nav button').forEach(x=>x.classList.toggle('active',x.dataset.v==='strategy'));
 document.getElementById('title').textContent='자격증 & 공기업 전략';
 document.getElementById('desc').textContent='공기업과 7급 공무원에 겹치는 자격부터 우선순위를 관리합니다.';
 renderStrategy();
}
function renderStrategy(){
 const root=document.getElementById('strategy');if(!root)return;
 const done=JOB_BASE_CERTS.filter(x=>certState[x.id]==='done').length;
 root.innerHTML=`<div class="hero"><div class="eyebrow" style="color:#d9d7ff">CERTIFICATE ROADMAP · 2026</div><h2>공통 자격부터 먼저 끝내기</h2><p>한국사 → TOEIC → 전기기사 → 컴활 1급 순으로 기반을 만들고, 그 뒤 지원기관에 맞춰 스피킹·쌍기사·안전계열을 추가하는 전략입니다.</p></div>
 <div class="cert-top">${m('취득 완료',done+' / '+JOB_BASE_CERTS.length,'내 자격증 로드맵')}${m('공통 최우선','한국사 1급','7급 2급 요건 + 공기업 활용')}${m('영어 목표','TOEIC 850+','7급 최소기준보다 여유 있게')}${m('전기직 핵심','전기기사','기술직 공무원 + 공기업')}</div>
 <div class="section"><h2>우선순위</h2></div><div class="card">${JOB_BASE_CERTS.map(c=>`<div class="cert-priority"><div class="rank">${c.rank}</div><div><b>${c.name}</b><div><span class="badge">${c.scope}</span> <span class="sub">목표 ${c.target}</span></div><small>${c.why}</small></div><div class="hide-m"><b style="font-size:11px">7급 공무원</b><small style="display:block">${c.gov}</small></div><div class="hide-m"><b style="font-size:11px">공기업</b><small style="display:block">${c.pub}</small></div><select onchange="certSave('${c.id}',this.value)"><option value="" ${!certState[c.id]?'selected':''}>미시작</option><option value="study" ${certState[c.id]==='study'?'selected':''}>준비중</option><option value="done" ${certState[c.id]==='done'?'selected':''}>취득완료</option><option value="hold" ${certState[c.id]==='hold'?'selected':''}>보류</option></select></div>`).join('')}</div>
 <div class="section"><h2>공무원 × 공기업 공통도</h2></div><div class="card" style="overflow:auto"><table class="compare"><thead><tr><th>자격</th><th>7급 공무원</th><th>공기업</th><th>판정</th></tr></thead><tbody><tr><td><b>한국사</b></td><td>국가직 7급 2급 이상 응시요건</td><td>여러 기관 가점/서류평가</td><td><span class="badge">완전 공통</span></td></tr><tr><td><b>TOEIC</b></td><td>국가직 7급 영어검정 기준</td><td>지원요건/서류점수로 널리 활용</td><td><span class="badge">완전 공통</span></td></tr><tr><td><b>전기기사</b></td><td>전기 등 기술직 7급 기사급 5%</td><td>전력·에너지·시설직 핵심</td><td><span class="badge">기술직 공통</span></td></tr><tr><td><b>컴활 1급</b></td><td>국가직 7급 공통 가산 아님</td><td>행정·사무 공공기관에서 활용</td><td>공기업 우세</td></tr><tr><td><b>OPIc</b></td><td>7급 필수 대체시험의 중심은 아님</td><td>일부 기관 스피킹 우대</td><td>보강용</td></tr></tbody></table></div>
 <div class="strategy-note" style="margin-top:14px"><b>중요:</b> 공기업은 기관별로 자격증 제도가 다릅니다. K-water는 일반공채에 공통 어학 최소요건이 없지만 1차에서 어학+자격증을 보고, 한수원 2026 대졸 기술직은 관련학과 전공 또는 관련 산업기사 이상 자격을 요구하며 별도 우대도 둡니다. 코레일도 자체 채용 시행세칙에서 공통·철도직무·IT 자격증을 따로 관리합니다. 따라서 '공기업 공통 필수 자격증'이라는 표현보다 '지원범위가 넓은 공통 스펙'으로 보는 게 정확합니다.</div>
 <div class="section"><h2>공기업 지원전략 티어</h2></div><p class="sub">※ 회사의 절대적 가치 순위가 아니라 전기·기술직 취준 관점에서 채용난도, 선호도, 보상, 직무연관성을 섞은 지원전략 분류입니다.</p><div class="tier-grid">${JOB_BASE_TIERS.map(t=>`<div class="tier-card"><div class="tier-letter">${t.tier} <span class="badge">${t.label}</span></div><p class="tier-note">${t.note}</p>${t.companies.map(c=>`<span class="company-chip">${c}</span>`).join('')}</div>`).join('')}</div>
 <div class="section"><h2>추천 실행 순서</h2></div><div class="card"><b>① 한국사 1급 → ② TOEIC 850+ → ③ 전기기사 → ④ 컴활 1급</b><p class="sub" style="line-height:1.8">여기까지가 1차 코어. 이후에는 목표기업 공고를 보고 OPIc/토스, 전기공사기사, 산업안전기사·소방설비기사, KBS한국어 등을 선택적으로 추가합니다. 7급 일반행정을 택한다면 전기기사는 제외하고 한국사 → TOEIC → 컴활 순으로 보면 됩니다.</p></div>`;
}
setTimeout(ensureStrategyUI,0);
