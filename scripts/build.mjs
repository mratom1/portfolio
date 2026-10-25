import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projects = JSON.parse(fs.readFileSync('projects.json','utf8'));
const ids=new Set();
for(const p of projects){if(ids.has(p.id))throw Error(`Duplicate project: ${p.id}`);ids.add(p.id);if(!p.image&&!p.icon)throw Error(`Missing project visual: ${p.id}`);for(const field of ['image','icon'])if(p[field]&&!fs.existsSync(p[field]))throw Error(`Missing ${p[field]}`)}
function visual(p){
 const platforms=(p.platforms||[]).map(escape).join(' · ');
 const caption=escape(p.imageCaption||'Project identity');
 const badge='PROJECT';
 if(p.image){
  const portrait=p.imageLayout==='portrait'||['relaxation','ai-srt-editor'].includes(p.id);
  const width=p.imageWidth||(p.id==='relaxation'?900:p.id==='ai-srt-editor'?780:1280);
  const height=p.imageHeight||(p.id==='relaxation'?2000:p.id==='ai-srt-editor'?1688:p.id==='my-pos'?847:p.id==='off-chat'?820:800);
  const screen=`<img class="screen" src="${escape(p.image)}" alt="${escape(p.title)} interface preview" loading="lazy" decoding="async" width="${width}" height="${height}">`;
  return `<div class="project-visual visual-${escape(p.tone)}"><span class="project-number mono">${badge} / ${escape(p.label)}</span>${portrait?`<div class="portrait-preview">${screen}<div class="preview-aside"><img src="${escape(p.icon)}" alt="" width="58" height="58" loading="lazy" decoding="async"><strong>${escape(p.title)}</strong><span>${platforms||escape(p.label)}</span></div></div>`:screen}<span class="preview-caption">${caption}</span></div>`;
 }
 return `<div class="project-visual visual-${escape(p.tone)}"><span class="project-number mono">${badge} / ${escape(p.label)}</span><div class="identity-preview"><img src="${escape(p.icon)}" alt="${escape(p.title)} project icon" loading="lazy" decoding="async" width="256" height="256"><div><strong>${escape(p.title)}</strong><span>${platforms||escape(p.label)}</span></div></div><span class="preview-caption">${caption}</span></div>`;
}
const cards=projects.map((p,i)=>`<article class="project" id="${escape(p.id)}" data-index="${i}" data-category="${escape(p.category)}">${visual(p)}<div class="project-details"><div class="mono" style="color:var(--acid);margin-bottom:12px">${escape(p.label)}</div><div class="project-title"><h3>${escape(p.title)}</h3><span class="project-status">PROJECT</span></div><p>${escape(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><button type="button" class="project-action" aria-label="Explore ${escape(p.title)}" data-open="${i}">EXPLORE PROJECT<span aria-hidden="true">↗</span></button><details><summary>Project details</summary><p>${escape(p.detail)}</p>${p.features.length?`<ul>${p.features.map(f=>`<li>${escape(f)}</li>`).join('')}</ul>`:''}<p>Built with: ${p.stack.map(escape).join(', ')}</p>${p.note?`<p>${escape(p.note)}</p>`:''}${p.creditUrl?`<a href="${escape(p.creditUrl)}" target="_blank" rel="noopener noreferrer">Original upstream ↗</a>`:''}</details></div></article>`).join('\n');
const filters=[['all','All projects'],['media','Media'],['business','Business'],['tools','Tools'],['ai','AI & creative'],['games','Games'],['web','Web & realtime']].map(([id,label])=>{const count=projects.filter(p=>id==='all'||p.category===id).length;return `<button type="button" class="filter${id==='all'?' active':''}" data-filter="${id}" aria-pressed="${id==='all'}">${label} <span>(${String(count).padStart(2,'0')})</span></button>`}).join('');
const template=fs.readFileSync('site.template.html','utf8');
const assetVersion=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex').slice(0,12);
const projectNames=projects.map(p=>p.title);
const tokens={FILTERS:filters,PROJECT_CARDS:cards,PROJECT_DATA:JSON.stringify(projects).replace(/</g,'\\u003c'),PROJECT_NAMES:escape(projectNames.length>1?`${projectNames.slice(0,-1).join(', ')} and ${projectNames.at(-1)}`:projectNames[0]||''),PROJECT_COUNT:projects.length,PROJECT_COUNT_PADDED:String(projects.length).padStart(2,'0')};
const html=template.replace(/\{\{([A-Z_]+)\}\}/g,(token,key)=>{if(!Object.prototype.hasOwnProperty.call(tokens,key))throw Error(`Unknown template token: ${token}`);return tokens[key]}).replace('href="styles.css"',`href="styles.css?v=${assetVersion('styles.css')}"`).replace('src="app.js"',`src="app.js?v=${assetVersion('app.js')}"`);
if(/\{\{[A-Z_]+\}\}/.test(html))throw Error('Unresolved template token');
new vm.Script(fs.readFileSync('app.js','utf8'));
fs.writeFileSync('index.html',html);
console.log(`Built ${projects.length} projects. All assets present; JavaScript syntax valid.`);
