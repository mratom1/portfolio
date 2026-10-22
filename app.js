'use strict';
document.documentElement.classList.add('js');
const projects=JSON.parse(document.getElementById('projectData').textContent);
const grid=document.getElementById('projectGrid');
const cards=[...grid.querySelectorAll('.project')];
const search=document.getElementById('projectSearch');
const filterButtons=[...document.querySelectorAll('.filter')];
let activeFilter='all';
function filterProjects(){
 const query=search.value.trim().toLocaleLowerCase();
 let visible=0;
 projects.forEach((p,i)=>{const match=activeFilter==='all'||(activeFilter==='apps'&&p.kind==='app')||(activeFilter==='concepts'&&p.kind==='concept')||(p.kind==='app'&&p.category===activeFilter);const haystack=[p.title,p.description,p.detail,...p.tags,...p.stack,...p.platforms,...p.features].join(' ').toLocaleLowerCase();cards[i].hidden=!(match&&haystack.includes(query));if(!cards[i].hidden)visible++});
 document.getElementById('resultCount').textContent=`${visible} ${visible===1?'project':'projects'}${activeFilter==='all'&&!query?' · 9 apps + 5 earlier concepts':''}`;
 document.getElementById('emptyMessage').hidden=visible>0;
}
filterButtons.forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;filterButtons.forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});filterProjects()}));
search.addEventListener('input',filterProjects);
const dialog=document.getElementById('projectDialog');
const closeButton=document.getElementById('closeModal');
let previousFocus,activeProject,returnToProject=false,previousHash='';
const tagNodes=(node,items)=>{node.replaceChildren(...items.map(text=>{const span=document.createElement('span');span.textContent=text;return span}))};
function openProject(index,updateHash=true){
 const p=projects[index];if(!p)return;
 if(!dialog.open){returnToProject=!cards[index].contains(document.activeElement);previousFocus=returnToProject?cards[index].querySelector('[data-open]'):document.activeElement;previousHash=location.hash.startsWith('#project/')?'#work':location.hash}
 activeProject=p;
 document.getElementById('modalCategory').textContent=p.kind==='concept'?`EARLIER CONCEPT · ${p.label}`:p.label;
 document.getElementById('modalTitle').textContent=p.title;
 document.getElementById('modalDescription').textContent=p.detail;
 document.getElementById('modalVisual').replaceChildren(cards[index].querySelector('.project-visual').cloneNode(true));
 document.getElementById('modalVisual').querySelectorAll('img').forEach(img=>{img.loading='eager'});
 document.getElementById('modalVisual').querySelector('.project-number')?.remove();
 tagNodes(document.getElementById('modalPlatforms'),p.platforms);
 tagNodes(document.getElementById('modalTags'),p.stack);
 document.getElementById('modalFeatures').replaceChildren(...p.features.map(f=>{const li=document.createElement('li');li.textContent=f;return li}));
 document.getElementById('featureSection').hidden=!p.features.length;
 const note=document.getElementById('modalNote');note.textContent=p.note||'';note.hidden=!p.note;
 const credit=document.getElementById('modalCredit');credit.hidden=!p.creditUrl;if(p.creditUrl)credit.href=p.creditUrl;else credit.removeAttribute('href');
 document.getElementById('shareStatus').textContent='';
 if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden'}
 dialog.scrollTop=0;closeButton.focus();
 if(updateHash)history.replaceState(null,'',`#project/${p.id}`);
}
function closeProject(){if(dialog.open)dialog.close()}
dialog.addEventListener('close',()=>{document.body.style.overflow='';if(location.hash.startsWith('#project/'))history.replaceState(null,'',previousHash||'#work');if(returnToProject)previousFocus?.scrollIntoView({block:'center',behavior:'instant'});previousFocus?.focus({preventScroll:true})});
closeButton.addEventListener('click',closeProject);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProject()}});
grid.addEventListener('click',e=>{const button=e.target.closest('[data-open]');if(button)openProject(Number(button.dataset.open))});
document.getElementById('modalContact').addEventListener('click',closeProject);
document.getElementById('shareProject').addEventListener('click',async()=>{if(!activeProject)return;const url=new URL(location.href);url.hash=`project/${activeProject.id}`;const status=document.getElementById('shareStatus');try{await navigator.clipboard.writeText(url.href);status.textContent='Project link copied.'}catch{status.textContent=url.href}});
function readProjectHash(){if(location.hash.startsWith('#project/')){let id;try{id=decodeURIComponent(location.hash.slice(9))}catch{return}const i=projects.findIndex(p=>p.id===id);if(i>=0)openProject(i,false)}else if(dialog.open)closeProject()}
window.addEventListener('hashchange',readProjectHash);readProjectHash();
const menuBtn=document.getElementById('menuBtn'),navLinks=document.getElementById('navLinks');
menuBtn.setAttribute('aria-controls','navLinks');
function closeMenu(){navLinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='☰'}
menuBtn.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰'});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navLinks.classList.contains('open')){closeMenu();menuBtn.focus()}});
const tech=['FLUTTER / DART','✳','RUST / GO','✳','REACT / WAILS','✳','PYTHON','✳','CREATIVE TOOLS','✳','OFFLINE-FIRST APPS','✳'];
document.getElementById('marquee').replaceChildren(...[...tech,...tech].map(t=>{const el=document.createElement(t==='✳'?'b':'span');el.textContent=t;return el}));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
const sections=[...document.querySelectorAll('main section[id]')],navAnchors=[...navLinks.querySelectorAll('a')];
window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});navAnchors.forEach(a=>{const active=a.hash==='#'+current;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{passive:true});
const glow=document.getElementById('cursorGlow');
if(matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches)window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
document.getElementById('copyEmail').addEventListener('click',async e=>{const button=e.currentTarget;try{await navigator.clipboard.writeText('mratom.mr619@gmail.com');button.textContent='COPIED ✓'}catch{button.textContent='EMAIL: mratom.mr619@gmail.com'}setTimeout(()=>button.textContent='COPY EMAIL ADDRESS ⧉',2500)});
document.getElementById('backTop').addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
document.getElementById('year').textContent=new Date().getFullYear();
