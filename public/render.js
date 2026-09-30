const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const mini = document.getElementById('mini');
const mctx = mini.getContext('2d');
const W = 1600, H = 1000;
const raceColors = { thien_phong: '#7ad5ff', am_moc: '#a2e59a', hoa_hac: '#ffb07c' };
let terrain = null, terrainMap = '';
let camera = { x: 0, y: 0, scale: 1 };
let effects = [];
let lastSnapshot = null;
let previousPositions = { players: new Map(), enemies: new Map() };
const facingById = new Map(), actorAnimations = new Map(), enemyHits = new Map();
let snapshotTime = 0, snapshotInterval = 50, snapshotMap = '';
let lastMinimap = 0;
let graphicsQuality = ['low','balanced','high'].includes(localStorage.getItem('machgioi_graphics')) ? localStorage.getItem('machgioi_graphics') : 'balanced';
let fps = 0, fpsFrames = 0, fpsStarted = performance.now();
const lerp = (a, b, t) => a + (b - a) * t;
const heroArt = new Image(); heroArt.src = '/assets/heroes-v1.png';
const enemyArt = new Image(); enemyArt.src = '/assets/enemies-v1.png';
const propArt = new Image(); propArt.src = '/assets/world-props-v1.png';
document.documentElement.dataset.graphics = graphicsQuality;

export function getGraphicsQuality() { return graphicsQuality; }
export function getRenderStats() { return { fps, snapshotMs: Math.round(snapshotInterval), quality: graphicsQuality }; }
export function setGraphicsQuality(next) {
  if (!['low','balanced','high'].includes(next)) return;
  graphicsQuality = next;
  localStorage.setItem('machgioi_graphics', next);
  document.documentElement.dataset.graphics = next;
  terrainMap = '';
}

export function pushSnapshot(state) {
  const now = performance.now();
  if (snapshotMap === state.self.map) {
    previousPositions = {
      players: new Map((lastSnapshot?.players || []).map(p => [p.id, p])),
      enemies: new Map((lastSnapshot?.enemies || []).map(e => [e.id, e]))
    };
    snapshotInterval = Math.max(35, Math.min(120, now - snapshotTime));
  } else {
    previousPositions = { players: new Map(), enemies: new Map() };
  }
  snapshotMap = state.self.map;
  snapshotTime = now;
  lastSnapshot = state;
}

function smoothPosition(item, kind, t) {
  const old = previousPositions[kind].get(item.id);
  const dx = old ? item.x - old.x : 0, dy = old ? item.y - old.y : 0;
  const key = `${kind}:${item.id}`;
  if (Math.abs(dx) > 1.2) facingById.set(key, Math.sign(dx));
  return { ...item, x: old ? lerp(old.x, item.x, t) : item.x, y: old ? lerp(old.y, item.y, t) : item.y, moving: Math.hypot(dx, dy) > 1.2, facing: facingById.get(key) || 1 };
}

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function circle(g, x, y, r, fill) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); }
function ellipse(g, x, y, rx, ry, fill) { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); }
function rounded(g, x, y, w, h, r, fill) { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); }

function makeTerrain(mapId, map) {
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const g = off.getContext('2d');
  const color = map.ground || '#6e9870';
  g.fillStyle = color; g.fillRect(0, 0, W, H);
  const rand = rng(mapId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  for (let i = 0; i < (graphicsQuality === 'low' ? 2500 : graphicsQuality === 'high' ? 10000 : 7500); i++) {
    const x = rand() * W, y = rand() * H;
    g.globalAlpha = .045 + rand() * .13;
    ellipse(g, x, y, 3 + rand() * 13, 1 + rand() * 6, rand() > .5 ? '#e7e3ae' : '#173d39');
  }
  g.globalAlpha = 1;
  // Path curves give the fixed 3/4 view a readable traversable ground plane.
  g.lineCap = 'round';
  g.strokeStyle = '#766a50'; g.lineWidth = 95;
  g.beginPath(); g.moveTo(780, 1020); g.bezierCurveTo(660, 700, 950, 500, 780, -20); g.stroke();
  g.strokeStyle = '#bca977'; g.lineWidth = 78; g.stroke();
  g.strokeStyle = '#d2be89'; g.lineWidth = 54; g.stroke();
  if (mapId === 'giao_hoi') {
    g.strokeStyle = '#c9b27f'; g.lineWidth = 70;
    g.beginPath(); g.moveTo(120, 540); g.bezierCurveTo(500, 460, 1000, 540, 1540, 520); g.stroke();
    const glow = g.createRadialGradient(800, 515, 30, 800, 515, 230); glow.addColorStop(0, '#ddd6ad70'); glow.addColorStop(1, '#ddd6ad00');
    circle(g, 800, 515, 230, glow);
  }
  if (mapId === 'arena') {
    ellipse(g, 800, 490, 430, 310, '#5a596a'); ellipse(g, 800, 490, 395, 280, '#8d8790'); ellipse(g, 800, 490, 370, 260, '#777786');
    g.strokeStyle = '#c4ac79'; g.lineWidth = 11; g.beginPath(); g.ellipse(800, 490, 360, 250, 0, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; circle(g, 800 + Math.cos(a) * 355, 490 + Math.sin(a) * 247, 9, '#d9c184'); }
  }
  if (mapId === 'am_moc') {
    g.fillStyle = '#417a79'; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(150, 200, 70, 420, 0, 560); g.closePath(); g.fill();
    g.strokeStyle = '#a4d9c7'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(150, 200, 70, 420, 0, 560); g.stroke();
  }
  if (mapId === 'hoa_hac') for (let i = 0; i < 12; i++) {
    const x = rand() * W, y = rand() * H;
    ellipse(g, x, y, 35 + rand() * 60, 10 + rand() * 20, '#6a5451');
    g.strokeStyle = '#e69c61'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 12, y); g.lineTo(x + 15, y - 5); g.stroke();
  }
  for (let i = 0; i < 260; i++) {
    const x = rand() * W, y = rand() * H;
    const c = rand() > .5 ? '#d6e7b3' : '#4b795a';
    g.strokeStyle = c; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y - 5); g.moveTo(x, y); g.lineTo(x + 3, y - 6); g.stroke();
    if (rand() > .83) { circle(g, x, y - 7, 2.5, rand() > .5 ? '#f3d795' : '#e5a5ae'); }
  }
  g.strokeStyle = '#314956'; g.lineWidth = 15; g.strokeRect(8, 8, W - 16, H - 16);
  return off;
}

function drawTree(g, x, y, time) {
  ellipse(g, x + 10, y + 9, 35, 12, '#142b2977');
  if(propArt.complete && propArt.naturalWidth){const cell=propArt.naturalWidth/3;g.save();g.translate(x,y);g.rotate(Math.sin(time/1700+x)*.012);g.drawImage(propArt,0,0,cell,propArt.naturalHeight,-68,-146,136,151);g.restore();return}
  g.strokeStyle = '#4b382a'; g.lineWidth = 20; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y - 73); g.stroke();
  g.strokeStyle = '#7f5840'; g.lineWidth = 12; g.beginPath(); g.moveTo(x - 4, y - 72); g.lineTo(x, y - 16); g.stroke();
  const sway = Math.sin(time / 900 + x) * 2;
  ellipse(g, x - 20 + sway, y - 88, 38, 24, '#315d3f');
  ellipse(g, x + 20 + sway, y - 87, 42, 27, '#396d45');
  ellipse(g, x + sway, y - 108, 44, 30, '#4f8855');
  ellipse(g, x - 7 + sway, y - 119, 25, 15, '#6ba269');
  for (let i = 0; i < 4; i++) circle(g, x - 30 + i * 20 + sway, y - 92 - (i % 2) * 13, 3, '#a9c981');
}
function drawOre(g, x, y) {
  ellipse(g, x + 3, y + 8, 27, 9, '#1a303777');
  if(propArt.complete && propArt.naturalWidth){const cell=propArt.naturalWidth/3;g.drawImage(propArt,cell,0,cell,propArt.naturalHeight,x-33,y-59,66,65);return}
  g.fillStyle = '#354754'; g.beginPath(); g.moveTo(x-24,y+3);g.lineTo(x-12,y-10);g.lineTo(x+19,y-8);g.lineTo(x+27,y+5);g.closePath();g.fill();
  [[-10,0,12,31],[6,-8,18,38],[17,2,8,22]].forEach(([dx,dy,w,h])=>{
    g.fillStyle = '#78e7f7'; g.beginPath();g.moveTo(x+dx,y+dy-h);g.lineTo(x+dx-w/2,y+dy-7);g.lineTo(x+dx,y+dy);g.lineTo(x+dx+w/2,y+dy-7);g.closePath();g.fill();
    g.fillStyle='#267cb4';g.beginPath();g.moveTo(x+dx,y+dy-h);g.lineTo(x+dx,y+dy);g.lineTo(x+dx+w/2,y+dy-7);g.closePath();g.fill();
  });
}
function drawHerb(g,x,y,time){ ellipse(g,x,y+4,20,7,'#123b2677');if(propArt.complete&&propArt.naturalWidth){const cell=propArt.naturalWidth/3;g.drawImage(propArt,cell*2,0,cell,propArt.naturalHeight,x-27,y-49+Math.sin(time/700+x)*.5,54,55);return}g.strokeStyle='#326e3c';g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-22);g.stroke();for(let i=0;i<4;i++){const a=i*Math.PI/2+time/3000;ellipse(g,x+Math.cos(a)*10,y-13+Math.sin(a)*7,11,5,'#91d57c')}circle(g,x,y-24,4,'#e4ecb4') }
function drawPortal(g,p,time){
  const color=p.to==='thien_phong'?'#77dafa':p.to==='am_moc'?'#8fe09a':p.to==='hoa_hac'?'#ef9a6b':'#d2b7f7';
  ellipse(g,p.x,p.y+9,52,17,'#101f2b99');
  g.save();g.shadowColor=color;g.shadowBlur=graphicsQuality==='low'?0:22;g.strokeStyle=color;g.lineWidth=8;g.beginPath();g.ellipse(p.x,p.y-34,28,55,0,Math.PI*.15,Math.PI*.85,true);g.stroke();
  g.strokeStyle='#d6d2af';g.lineWidth=12;g.beginPath();g.moveTo(p.x-31,p.y+4);g.lineTo(p.x-31,p.y-55);g.quadraticCurveTo(p.x,p.y-98,p.x+31,p.y-55);g.lineTo(p.x+31,p.y+4);g.stroke();
  g.fillStyle=color+'66';g.beginPath();g.ellipse(p.x,p.y-33,24+Math.sin(time/450)*2,43,0,0,Math.PI*2);g.fill();g.restore();
  g.save();g.globalAlpha=.35+Math.sin(time/330+p.x)*.2;g.strokeStyle=color;g.lineWidth=3;g.beginPath();g.ellipse(p.x,p.y-33,20+Math.sin(time/600)*4,38,0,0,Math.PI*2);g.stroke();g.restore();
  for(let i=0;i<3;i++){const phase=time/800+i*2.1+p.x;circle(g,p.x+Math.sin(phase)*24,p.y-18-((time/25+i*19)%62),2.2,color)}
  circle(g,p.x,p.y-48+Math.sin(time/400)*3,5,'#fff6df');
  label(g,p.label,p.x,p.y-108,'#f5ecd7');
}
function drawPerson(g,p,self=false,time=0){
  const x=p.x,y=p.y,color=raceColors[p.race]||'#d3b778';
  ellipse(g,x+4,y+8,22,8,'#071b2477');
  if(heroArt.complete && heroArt.naturalWidth && p.race){
    const index=p.race==='thien_phong'?0:p.race==='am_moc'?1:2;
    const cell=heroArt.naturalWidth/3;
    const action=actorAnimations.get(p.id), age=action?time-action.start:Infinity;
    const active=age<(action?.duration||0), phase=active?age/action.duration:1;
    const bob=Math.sin(time/(p.moving?105:480)+x)*(p.moving?3.2:1.2);
    let lean=Math.sin(time/(p.moving?130:650)+x)*(p.moving?.055:.012);
    let lunge=0;
    if(active&&action.kind==='slash'){lean-=Math.sin(phase*Math.PI)*.22;lunge=Math.sin(phase*Math.PI)*10}
    if(active&&action.kind==='hurt')lean+=Math.sin(phase*24)*.07*(1-phase);
    if(active&&['fire','lightning','heal'].includes(action.kind))lean+=Math.sin(phase*Math.PI)*.09;
    g.save();g.translate(x+(p.facing||1)*lunge,y);g.scale(p.facing||1,1);g.rotate(lean);g.scale(1,1+Math.sin(time/380+x)*.014);
    g.drawImage(heroArt,index*cell,0,cell,heroArt.naturalHeight,-36,-102+bob,72,108);
    g.restore();
    if(p.moving&&graphicsQuality!=='low'){g.save();g.globalAlpha=.2+Math.abs(Math.sin(time/110+x))*.18;ellipse(g,x-11,y+5,6,2,'#e5d8aa');ellipse(g,x+10,y+4,5,2,'#e5d8aa');g.restore()}
    if(active&&action.kind==='hurt'){g.save();g.globalAlpha=(1-phase)*.25;circle(g,x,y-48,42,'#ff6357');g.restore()}
    if(active&&['fire','lightning','heal'].includes(action.kind)){g.save();g.globalAlpha=(1-phase)*.5;g.strokeStyle=color;g.lineWidth=3;g.beginPath();g.ellipse(x,y-39,36+phase*14,49+phase*9,0,0,Math.PI*2);g.stroke();g.restore()}
    if(self){g.save();g.globalAlpha=.2+Math.sin(time/400)*.09;g.strokeStyle=color;g.lineWidth=2;g.beginPath();g.ellipse(x,y-39,32,52,0,0,Math.PI*2);g.stroke();g.restore()}
    label(g,p.name,x,y-113,self?'#fff1c5':'#eaf1ed');
    rounded(g,x-20,y-106,40,4,2,'#17272a');rounded(g,x-20,y-106,40*Math.max(0,Math.min(1,p.hp/(p.race==='am_moc'?145:p.race==='hoa_hac'?135:120))),4,2,'#d6625c');
    return;
  }
  // The sprite is hand drawn in the 2D plane; the shadow and overlap provide the 3/4 read.
  g.fillStyle='#24283a';g.beginPath();g.moveTo(x-10,y-8);g.lineTo(x-14,y+5);g.lineTo(x-4,y+6);g.lineTo(x,y-6);g.lineTo(x+5,y+7);g.lineTo(x+16,y+6);g.lineTo(x+10,y-10);g.closePath();g.fill();
  g.fillStyle=color;g.beginPath();g.moveTo(x-14,y-35);g.lineTo(x+14,y-35);g.lineTo(x+17,y-9);g.lineTo(x-15,y-9);g.closePath();g.fill();
  rounded(g,x-12,y-35,24,10,3,'#dee7d8');
  g.fillStyle='#e7baa0';rounded(g,x-12,y-52,24,24,8,'#e4ad88');
  g.fillStyle='#1b2639';g.beginPath();g.moveTo(x-13,y-42);g.lineTo(x-17,y-51);g.lineTo(x-5,y-64);g.lineTo(x+10,y-61);g.lineTo(x+17,y-48);g.lineTo(x+12,y-39);g.lineTo(x+6,y-53);g.closePath();g.fill();
  g.fillStyle='#eef3eb';circle(g,x+4,y-40,2,'#ecf5f2');
  g.strokeStyle='#b88755';g.lineWidth=5;g.beginPath();g.moveTo(x+14,y-25);g.lineTo(x+27,y-15);g.stroke();
  g.strokeStyle='#d5e8e8';g.lineWidth=4;g.beginPath();g.moveTo(x+25,y-16);g.lineTo(x+38,y-38);g.stroke();
  if(self){g.save();g.globalAlpha=.25+Math.sin(time/400)*.12;g.strokeStyle=color;g.lineWidth=2;g.beginPath();g.ellipse(x,y-17,27,40,0,0,Math.PI*2);g.stroke();g.restore()}
  label(g,p.name,x,y-72,self?'#fff1c5':'#eaf1ed');
  if(p.race){rounded(g,x-19,y-65,38,4,2,'#17272a');rounded(g,x-19,y-65,38* Math.max(0,Math.min(1,p.hp/(p.race==='am_moc'?145:p.race==='hoa_hac'?135:120))),4,2,'#d6625c')}
}
function drawNpc(g,n,time){ellipse(g,n.x+4,n.y+7,20,7,'#17263277');g.fillStyle='#5d433c';g.beginPath();g.moveTo(n.x-17,n.y-8);g.lineTo(n.x-12,n.y-46);g.lineTo(n.x+12,n.y-46);g.lineTo(n.x+17,n.y-8);g.closePath();g.fill();circle(g,n.x,n.y-52+Math.sin(time/650+n.x)*1.2,13,'#e5b995');g.fillStyle='#f1dfad';g.beginPath();g.moveTo(n.x-14,n.y-57);g.lineTo(n.x,n.y-78);g.lineTo(n.x+14,n.y-57);g.closePath();g.fill();circle(g,n.x,n.y-89+Math.sin(time/300+n.x)*3,8,'#f5d27b');label(g,n.name,n.x,n.y-102,'#fff1d0')}
function drawEnemy(g,e,time){
  const boss=e.kind==='boss',x=e.x,y=e.y;
  ellipse(g,x+4,y+7,boss?62:23,boss?19:8,'#15211f7b');
  const artIndex=e.kind==='thien_phong'?0:e.kind==='am_moc'?1:e.kind==='hoa_hac'?2:boss?3:-1;
  if(enemyArt.complete && enemyArt.naturalWidth && artIndex>=0){
    const cell=enemyArt.naturalWidth/4, width=boss?134:72, height=boss?148:80;
    const stride=Math.sin(time/(e.moving?145:510)+x)*(e.moving?3.5:1.2);
    if(boss){g.save();g.globalAlpha=.3+Math.sin(time/340)*.1;g.strokeStyle=e.phase===2?'#d39aff':'#eed49a';g.lineWidth=4;g.beginPath();g.ellipse(x,y-4,61+Math.sin(time/500)*4,20,0,0,Math.PI*2);g.stroke();g.restore()}
    g.save();g.translate(x,y);g.scale(e.facing||1,1);g.rotate(Math.sin(time/(e.moving?180:700)+x)*(boss ? 0.022 : e.moving ? 0.055 : 0.016));
    g.drawImage(enemyArt,artIndex*cell,0,cell,enemyArt.naturalHeight,-width/2,-height+7+stride,width,height);
    g.restore();
    const hitAt=enemyHits.get(e.id);if(hitAt&&time-hitAt<210){g.save();g.globalAlpha=(1-(time-hitAt)/210)*.55;circle(g,x,y-(boss?68:35),boss?67:34,'#fff1c7');g.restore()}
    rounded(g,x-(boss?46:22),y-(boss?157:77),boss?92:44,5,2,'#2a2830');
    rounded(g,x-(boss?46:22),y-(boss?157:77),(boss?92:44)*e.hp/e.maxHp,5,2,boss?'#e59a75':'#e36a66');
    if(boss)label(g,'THỦ HỘ TAM GIỚI',x,y-168,'#ffe7bd');
    return;
  }
  if(boss){g.save();g.shadowColor='#efae81';g.shadowBlur=25;ellipse(g,x,y-52,45,54,'#594b68');ellipse(g,x,y-62,37,40,'#8c7594');g.fillStyle='#f0b474';g.beginPath();g.moveTo(x-43,y-77);g.lineTo(x-27,y-127);g.lineTo(x-7,y-84);g.lineTo(x+7,y-84);g.lineTo(x+27,y-127);g.lineTo(x+43,y-77);g.closePath();g.fill();circle(g,x-14,y-70,5,'#ffed9a');circle(g,x+14,y-70,5,'#ffed9a');g.restore();}
  else {const color=e.kind==='hoa_hac'?'#d97956':e.kind==='am_moc'?'#69a35f':'#84b4c5';ellipse(g,x,y-20,22,20,color);ellipse(g,x-13,y-29,10,12,color);ellipse(g,x+13,y-29,10,12,color);circle(g,x-7,y-22,2,'#19222a');circle(g,x+7,y-22,2,'#19222a');ellipse(g,x,y-6,17,6,'#314c42')}
  rounded(g,x-(boss?46:22),y-(boss?133:55),boss?92:44,5,2,'#2a2830');rounded(g,x-(boss?46:22),y-(boss?133:55),(boss?92:44)*e.hp/e.maxHp,5,2,boss?'#e59a75':'#e36a66');
  if(boss)label(g,'THỦ HỘ TAM GIỚI',x,y-148,'#ffe7bd');
}
function label(g,text,x,y,color){g.font='bold 13px Segoe UI,Arial';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#102029';g.strokeText(text,x,y);g.fillStyle=color;g.fillText(text,x,y)}

function renderMinimap(state){
  const g=mctx;g.clearRect(0,0,170,170);g.fillStyle=state.map.ground;g.fillRect(0,0,170,170);
  g.strokeStyle='#cbb984';g.lineWidth=9;g.beginPath();g.moveTo(85,170);g.bezierCurveTo(65,100,110,80,85,0);g.stroke();
  for(const portal of state.map.portals){circle(g,portal.x/W*170,portal.y/H*170,4,'#eecb7d')}
  for(const p of state.players){circle(g,p.x/W*170,p.y/H*170,p.id===state.self.id?5:3,p.id===state.self.id?'#fff6d8':'#72d8ee')}
}

export function addEffect(effect){
  const now=performance.now();
  const duration=effect.duration||({slash:320,lightning:520,fire:650,heal:720,gather:520,hurt:480,damage:740}[effect.kind]||850);
  effects.push({...effect,start:now,duration});
  if(effects.length>120)effects.splice(0,effects.length-120);
  if(effect.actorId&&['slash','lightning','fire','heal','gather','hurt'].includes(effect.kind))actorAnimations.set(effect.actorId,{kind:effect.kind,start:now,duration:Math.min(duration,650)});
  if(effect.enemyId)enemyHits.set(effect.enemyId,now);
}

export function getNearby(state){if(!state)return null;const p=state.self;const candidates=[...state.map.portals.map(x=>({...x,type:'portal',radius:95})),...state.map.npcs.map(x=>({...x,type:'npc',radius:100})),...state.resources.map(x=>({...x,type:'resource',radius:100}))];return candidates.filter(x=>Math.hypot(x.x-p.x,x.y-p.y)<x.radius).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]||null}

export function render(state){
  const frameNow=performance.now();fpsFrames++;if(frameNow-fpsStarted>=1000){fps=Math.round(fpsFrames*1000/(frameNow-fpsStarted));fpsFrames=0;fpsStarted=frameNow}
  const dpr=Math.min(devicePixelRatio||1,graphicsQuality==='low'?1:graphicsQuality==='high'?2:1.5),w=canvas.clientWidth,h=canvas.clientHeight;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(!state){ctx.fillStyle='#182d35';ctx.fillRect(0,0,w,h);return}
  if(terrainMap!==state.self.map){terrain=makeTerrain(state.self.map,state.map);terrainMap=state.self.map}
  const now=performance.now(), t=Math.min(1,Math.max(0,(now-snapshotTime)/snapshotInterval));
  const visibleSelf=smoothPosition(state.self,'players',t);
  const scale=Math.max(.85,Math.min(1.1,Math.min(w/980,h/670)));
  camera={x:Math.max(0,Math.min(W-w/scale,visibleSelf.x-w/(2*scale))),y:Math.max(0,Math.min(H-h/scale,visibleSelf.y-h/(2*scale))),scale};
  ctx.save();ctx.scale(scale,scale);ctx.translate(-camera.x,-camera.y);
  const sx=Math.max(0,Math.floor(camera.x)),sy=Math.max(0,Math.floor(camera.y));
  const sw=Math.min(W-sx,Math.ceil(w/scale)+3),sh=Math.min(H-sy,Math.ceil(h/scale)+3);
  if(sw>0&&sh>0)ctx.drawImage(terrain,sx,sy,sw,sh,sx,sy,sw,sh);
  const objects=[...state.resources.map(x=>({...x,renderType:'resource'})),...state.map.portals.map(x=>({...x,renderType:'portal'})),...state.map.npcs.map(x=>({...x,renderType:'npc'})),...state.enemies.map(x=>({...smoothPosition(x,'enemies',t),renderType:'enemy'})),...state.players.map(x=>({...smoothPosition(x,'players',t),renderType:'player'}))];
  objects.sort((a,b)=>a.y-b.y);
  for(const obj of objects){
    if(obj.x<camera.x-170||obj.x>camera.x+w/scale+170||obj.y<camera.y-190||obj.y>camera.y+h/scale+150)continue;
    if(obj.renderType==='resource'){if(obj.kind==='wood')drawTree(ctx,obj.x,obj.y,now);else if(obj.kind==='ore')drawOre(ctx,obj.x,obj.y);else drawHerb(ctx,obj.x,obj.y,now)}
    if(obj.renderType==='portal')drawPortal(ctx,obj,now);
    if(obj.renderType==='npc')drawNpc(ctx,obj,now);
    if(obj.renderType==='enemy')drawEnemy(ctx,obj,now);
    if(obj.renderType==='player')drawPerson(ctx,obj,obj.id===state.self.id,now);
  }
  effects=effects.filter(e=>now-e.start<e.duration);
  for(const e of effects){
    const t=(now-e.start)/e.duration;
    if(e.x<camera.x-180||e.x>camera.x+w/scale+180||e.y<camera.y-220||e.y>camera.y+h/scale+180)continue;
    ctx.save();ctx.globalAlpha=1-t;
    if(e.kind==='damage')label(ctx,`-${e.value}`,e.x,e.y-65-t*48,'#ffd790');
    else if(e.kind==='heal'){
      ctx.strokeStyle='#9aefae';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y-22,18+t*36,10+t*24,0,0,Math.PI*2);ctx.stroke();
      if(e.value)label(ctx,`+${e.value}`,e.x,e.y-78-t*35,'#a8f1ab');
      for(let i=0;i<6;i++){const a=i*Math.PI/3+t*2;circle(ctx,e.x+Math.cos(a)*(15+t*34),e.y-28+Math.sin(a)*(10+t*18)-t*25,3,'#a8f1ab')}
    }
    else if(e.kind==='warning'){ctx.globalAlpha=.5+Math.sin(now/80)*.15;ellipse(ctx,e.x,e.y,110,70,'#f2545455');ctx.strokeStyle='#ff8f6e';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(e.x,e.y,110,70,0,0,Math.PI*2);ctx.stroke()}
    else if(e.kind==='lightning'){
      ctx.strokeStyle='#9aeaff';ctx.lineWidth=7*(1-t)+2;ctx.shadowColor='#62cbff';ctx.shadowBlur=graphicsQuality==='low'?0:18;ctx.beginPath();ctx.moveTo(e.x-14,e.y-170);for(let i=1;i<=7;i++)ctx.lineTo(e.x-14+Math.sin(i*7+t*19)*17,e.y-170+i*20);ctx.stroke();
      circle(ctx,e.x,e.y-15,14+t*27,'#9adfff88');
    }
    else if(e.kind==='fire'){
      ctx.strokeStyle='#ff9c55';ctx.lineWidth=6*(1-t)+1;ctx.shadowColor='#ff662d';ctx.shadowBlur=graphicsQuality==='low'?0:18;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(e.x,e.y-20,25+t*75+i*9,13+t*37+i*4,0,(i*.7+t*4)%6,Math.PI*1.5+i*.7+t*4);ctx.stroke()}
    }
    else if(e.kind==='slash'){
      ctx.strokeStyle='#d9f3ff';ctx.lineWidth=11*(1-t)+2;ctx.shadowColor='#75d6fa';ctx.shadowBlur=graphicsQuality==='low'?0:20;
      ctx.beginPath();ctx.arc(e.x,e.y-27,13+t*42,-Math.PI*.8+t*1.6,Math.PI*.55+t*1.6);ctx.stroke();
    }
    else if(e.kind==='gather'){
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;circle(ctx,e.x+Math.cos(a)*(9+t*26),e.y-15+Math.sin(a)*(7+t*15)-t*27,2.5,'#f7d780')}
    }
    else{ctx.strokeStyle=e.kind==='hurt'?'#ff7771':'#8ae8ff';ctx.lineWidth=7*(1-t)+2;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=graphicsQuality==='low'?0:22;ctx.beginPath();ctx.arc(e.x,e.y-25,10+t*65,Math.PI*.2,Math.PI*1.8);ctx.stroke()}
    ctx.restore();
  }
  for(const [id,animation] of actorAnimations)if(now-animation.start>animation.duration)actorAnimations.delete(id);
  for(const [id,hitAt] of enemyHits)if(now-hitAt>210)enemyHits.delete(id);
  ctx.restore();if(now-lastMinimap>100){renderMinimap(state);lastMinimap=now}
}
