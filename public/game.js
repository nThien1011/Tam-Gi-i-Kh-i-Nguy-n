import { render, addEffect, getNearby, pushSnapshot, getGraphicsQuality, setGraphicsQuality, getRenderStats } from './render.js';

const $ = selector => document.querySelector(selector);
let content = null, state = null, ws = null, token = localStorage.getItem('machgioi_token');
let registerMode = false, openPanelName = null, latestPanelKey = '';
let racePending = false;
const cooldownTimers = new Map();
const keys = new Set();
const touch = { dx: 0, dy: 0 };
let lastInput = '';
const esc = text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const send = payload => { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload)); };

function toast(text) {
  const node = document.createElement('div');
  node.className = 'toast'; node.textContent = text;
  $('#toast-stack').append(node);
  setTimeout(() => node.remove(), 3400);
}

function chat(name, text) {
  const log = $('#chat-log');
  const row = document.createElement('p');
  const b = document.createElement('b'); b.textContent = name + ' ';
  row.append(b, document.createTextNode(text)); log.append(row);
  while (log.childElementCount > 35) log.firstElementChild.remove();
  log.scrollTop = log.scrollHeight;
}

function showCooldown(action, ms) {
  for (const button of [document.querySelector(`#action-${action}`), document.querySelector(`[data-action="${action}"]`)]) {
    if (!button) continue;
    button.classList.remove('cooldown-active');
    void button.offsetWidth;
    button.style.setProperty('--cooldown-duration', `${ms}ms`);
    button.classList.add('cooldown-active');
  }
  clearTimeout(cooldownTimers.get(action));
  cooldownTimers.set(action, setTimeout(() => {
    for (const button of [document.querySelector(`#action-${action}`), document.querySelector(`[data-action="${action}"]`)]) button?.classList.remove('cooldown-active');
  }, ms));
}

function setAuthVisible(visible) { $('#auth-screen').hidden = !visible; }

async function auth(mode, username, password) {
  const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, username, password }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Đăng nhập không thành công.');
  token = result.token;
  localStorage.setItem('machgioi_token', token);
  connect();
}

function connect() {
  if (!token) return setAuthVisible(true);
  if (ws && ws.readyState <= WebSocket.OPEN) ws.close();
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${location.host}/ws?token=${encodeURIComponent(token)}`);
  ws.addEventListener('open', () => { setAuthVisible(false); toast('Đã kết nối Mạch Giới.'); });
  ws.addEventListener('message', event => {
    let message; try { message = JSON.parse(event.data); } catch { return; }
    if (message.type === 'state') {
      const previousQuest = state?.self.questId;
      state = message; pushSnapshot(message); syncUi();
      if (state.self.race) racePending = false;
      if (!state.self.race && !openPanelName && !racePending) panel('race');
      if (previousQuest && previousQuest !== state.self.questId && openPanelName === 'inventory') renderPanel();
    }
    else if (message.type === 'notice') toast(message.text);
    else if (message.type === 'effect') addEffect(message);
    else if (message.type === 'cooldown') showCooldown(message.action, message.ms);
    else if (message.type === 'openPanel') panel(message.panel);
    else if (message.type === 'story') panel('story', message.chapter);
    else if (message.type === 'chat') chat(message.name, message.text);
    else if (message.type === 'welcome' && message.story === 0) panel('story', 0);
  });
  ws.addEventListener('close', event => {
    state = null;
    if (event.code === 4001) toast('Tài khoản đã đăng nhập ở nơi khác.');
    else if (event.code === 1006 && token) { toast('Mất kết nối. Đang thử kết nối lại...'); setTimeout(connect, 2500); }
    else if (token) setTimeout(connect, 2500);
  });
}

function syncUi() {
  if (!state) return;
  const p = state.self, race = content.races[p.race];
  $('#player-name').textContent = p.name;
  $('#player-level').textContent = `Lv. ${p.level} · Mốc ${p.milestone}`;
  $('#avatar').style.borderColor = race?.color || '#d6c27b';
  const avatarClass = `avatar${p.race ? ` race-${p.race}` : ''}`;
  if ($('#avatar').className !== avatarClass) $('#avatar').className = avatarClass;
  const avatarText = p.race ? '' : '✦';
  if ($('#avatar').textContent !== avatarText) $('#avatar').textContent = avatarText;
  const maxHp = (race?.hp || 120) + (p.level - 1) * 10, maxKi = race?.ki || 100;
  $('#hp-fill').style.width = `${Math.max(0, p.hp / maxHp * 100)}%`;
  $('#ki-fill').style.width = `${Math.max(0, p.ki / maxKi * 100)}%`;
  $('#hp-text').textContent = `${Math.ceil(p.hp)} / ${maxHp}`;
  $('#ki-text').textContent = `${Math.ceil(p.ki)} / ${maxKi}`;
  $('#map-name').textContent = state.map.name;
  $('#mini-map-label').textContent = state.map.name;
  $('#gold').textContent = p.gold.toLocaleString('vi-VN');
  $('#wood').textContent = p.inventory.wood;
  $('#ore').textContent = p.inventory.ore;
  if (state.quest) {
    $('#quest-title').textContent = state.quest.title;
    $('#quest-description').textContent = state.quest.description;
    $('#quest-count').textContent = `${p.questProgress} / ${state.quest.target}`;
    $('#quest-progress-fill').style.width = `${p.questProgress / state.quest.target * 100}%`;
    $('#claim-quest').hidden = !p.questReady;
  } else {
    $('#quest-title').textContent = `Khế ước săn quái · lần ${p.bountiesClaimed + 1}`;
    $('#quest-description').textContent = 'Hạ 25 dị thú ở ba vùng tộc. Thưởng 160 Đồng Linh, 180 EXP, 3 tinh chất và 1 mảnh lõi.';
    $('#quest-count').textContent = `${p.bountyProgress} / 25`;
    $('#quest-progress-fill').style.width = `${p.bountyProgress / 25 * 100}%`;
    $('#claim-quest').hidden = p.bountyProgress < 25;
  }
  const nearby = getNearby(state);
  $('#interact-hint').hidden = !nearby;
  if (nearby) $('#interact-hint').innerHTML = `Nhấn <kbd>F</kbd> để ${nearby.type === 'portal' ? `đến ${esc(nearby.label)}` : nearby.type === 'npc' ? `nói chuyện với ${esc(nearby.name)}` : 'thu thập'}`;
  if (openPanelName === 'inventory' || openPanelName === 'forge') {
    const key = JSON.stringify([p.inventory,p.gold,p.weaponStars,p.level]);
    if (key !== latestPanelKey) { latestPanelKey = key; renderPanel(); }
  }
}

function panel(name, chapter = null) {
  if (!content) return;
  openPanelName = name;
  $('#modal').hidden = false;
  $('#modal').dataset.chapter = chapter === null ? '' : String(chapter);
  renderPanel();
}

function closePanel() {
  if (openPanelName === 'story' && $('#modal').dataset.chapter !== '') send({ type: 'storySeen', chapter: Number($('#modal').dataset.chapter) });
  openPanelName = null;
  $('#modal').hidden = true;
  if (state && !state.self.race && !racePending) panel('race');
}

function renderPanel() {
  if (!openPanelName || !content) return;
  const p = state?.self;
  const root = $('#modal-content');
  if (openPanelName === 'race') {
    root.innerHTML = `<div class="eyebrow">KHỞI ĐẦU HÀNH TRÌNH</div><h2>Chọn tộc của bạn</h2><p class="lead">Ba mạch năng lượng tạo nên ba cách chiến đấu. Lựa chọn được lưu cho nhân vật này.</p><div class="modal-grid">${Object.entries(content.races).map(([id,r],index)=>`<button class="option-card race-option" data-race="${id}"><span class="race-art race-art-${index}" aria-hidden="true"></span><strong>${r.name}</strong><p>${r.description}</p><small>Kỹ năng: ${r.skill}</small></button>`).join('')}</div>`;
    root.querySelectorAll('[data-race]').forEach(button => button.onclick = () => { racePending = true; send({ type: 'chooseRace', race: button.dataset.race }); closePanel(); setTimeout(() => { if (state && !state.self.race) { racePending = false; panel('race'); } }, 1500); });
  } else if (openPanelName === 'inventory') {
    root.innerHTML = `<div class="eyebrow">NHÂN VẬT · ${esc(content.races[p?.race]?.name || 'CHƯA CHỌN TỘC')}</div><h2>Túi đồ</h2><p class="lead">Vũ khí khởi hành <b style="color:#ebcc83">${'★'.repeat(p?.weaponStars || 0)}${'☆'.repeat(10-(p?.weaponStars || 0))}</b> · Đồng Linh: ${p?.gold || 0}</p><div class="item-grid">${Object.entries(content.items).map(([id,item])=>`<div class="item-slot"><div class="icon">${item.icon}</div><span>${item.name}</span><b>× ${p?.inventory[id] || 0}</b></div>`).join('')}</div><p>Chế 1 bình hồi phục: 2 lá hồi sinh + 1 tinh chất dị thú.</p><div class="modal-actions"><button id="craft-potion" class="primary">Chế bình hồi phục</button><button class="secondary" data-next="forge">Đến lò rèn</button><button class="secondary" data-next="shop">Xem cửa hàng</button></div>`;
    $('#craft-potion').onclick = () => send({ type: 'craftPotion' });
  } else if (openPanelName === 'forge') {
    const stars = p?.weaponStars || 0, wood = 3+stars*4, ore = 2+stars*3, gold = 30+stars*80, shard = stars>=3?Math.ceil((stars-2)/2):0;
    root.innerHTML = `<div class="eyebrow">TRANG BỊ & CHẾ TẠO</div><h2>Lò rèn Giao Hội</h2><p class="lead">Vũ khí của bạn hiện đạt <b>${stars}/10 sao</b>. Mỗi sao tăng sát thương tấn công và kỹ năng.</p><div class="item-card"><span style="font-size:42px">⚔</span><strong>Vũ khí khởi hành · ${'★'.repeat(stars)}${'☆'.repeat(10-stars)}</strong><p>Chi phí nâng tiếp: ${wood} Gỗ mạch · ${ore} Quặng linh · ${gold} Đồng Linh${shard?` · ${shard} Mảnh lõi`:''}.</p><small>Nâng cấp trong bản chơi thử thành công chắc chắn.</small></div><div class="modal-actions"><button id="do-upgrade" class="primary" ${stars>=10?'disabled':''}>${stars>=10?'Đã tối đa':'Nâng lên '+(stars+1)+' sao'}</button><button class="secondary" data-next="inventory">Xem túi đồ</button></div>`;
    $('#do-upgrade').onclick = () => send({ type:'upgrade' });
  } else if (openPanelName === 'shop') {
    root.innerHTML = `<div class="eyebrow">MẠCH GIỚI · CỬA HÀNG</div><h2>Gói hành trình</h2><p class="lead">Thiết kế gói nạp đã có trong kế hoạch game. Bản chạy tại máy chưa kết nối đơn vị thanh toán, nên hiện không nhận tiền hoặc cấp hàng trả phí.</p><div class="modal-grid">${content.shop.map(item=>`<div class="item-card"><small>${item.priceLabel}</small><strong>${item.name}</strong><p>${item.description}</p><p>${item.contents}</p><button class="secondary" disabled>Chưa mở bán</button></div>`).join('')}</div><div class="shop-note">Giá, giới hạn mua và chỉ số vũ khí sẽ được chốt sau khi cân bằng tiến độ farm và tích hợp thanh toán thật.</div>`;
  } else if (openPanelName === 'settings') {
    const quality=getGraphicsQuality(), stats=getRenderStats();
    root.innerHTML = `<div class="eyebrow">TÙY CHỈNH MÁY TÍNH</div><h2>Đồ họa & hiệu năng</h2><p class="lead">Nếu máy bị giật, chọn Tiết kiệm. Trò chơi sẽ giảm độ phân giải Canvas và hiệu ứng làm mờ.</p><div class="quality-options"><button class="secondary quality-option" data-quality="low" aria-pressed="${quality==='low'}">Tiết kiệm</button><button class="secondary quality-option" data-quality="balanced" aria-pressed="${quality==='balanced'}">Cân bằng</button><button class="secondary quality-option" data-quality="high" aria-pressed="${quality==='high'}">Chi tiết cao</button></div><p id="perf-readout" class="performance-note">${stats.fps} FPS · đồng bộ ${stats.snapshotMs} ms</p><p>Chế độ được nhớ trên trình duyệt này. Di chuyển và chiến đấu luôn do máy chủ local xử lý.</p>`;
    root.querySelectorAll('[data-quality]').forEach(button=>button.onclick=()=>{setGraphicsQuality(button.dataset.quality);renderPanel()});
  } else if (openPanelName === 'story') {
    const chapter = Number($('#modal').dataset.chapter || 0), story = content.story[chapter] || content.story[0];
    const unlocked=Math.max(chapter+1,p?.storySeen||0);
    root.innerHTML = `<div class="eyebrow">CỐT TRUYỆN · CHƯƠNG ${chapter+1}</div><h2>${story.title}</h2><div class="story-chapters">${content.story.map((entry,index)=>`<button class="secondary" data-chapter="${index}" ${index>=unlocked?'disabled':''} aria-pressed="${chapter===index}">${index+1}. ${entry.title}</button>`).join('')}</div><div class="story-copy"><p class="lead">${story.text}</p></div><p>Hành trình đầu tiên: chọn tộc, học cách dùng KI, giải cứu ba vùng và đối mặt với Thủ Hộ Tam Giới.</p><div class="modal-actions"><button id="story-continue" class="primary">Tiếp tục hành trình</button></div>`;
    root.querySelectorAll('[data-chapter]').forEach(button=>button.onclick=()=>panel('story',Number(button.dataset.chapter)));
    $('#story-continue').onclick = closePanel;
  } else if (openPanelName === 'help') {
    root.innerHTML = `<div class="eyebrow">HƯỚNG DẪN</div><h2>Cách chơi</h2><div class="modal-grid"><div class="item-card"><strong>Di chuyển</strong><p>WASD hoặc phím mũi tên. Trên điện thoại dùng cần điều khiển bên trái.</p></div><div class="item-card"><strong>Chiến đấu</strong><p>J đánh thường, K dùng kỹ năng. Đến gần quái trước khi tấn công.</p></div><div class="item-card"><strong>Khám phá</strong><p>F tương tác với cổng, NPC, cây, quặng và dược liệu.</p></div><div class="item-card"><strong>Sống sót</strong><p>H dùng bình hồi phục. Chế thêm bình trong Túi đồ bằng lá hồi sinh và tinh chất dị thú. Vào Giao Hội để hồi máu và KI.</p></div></div><p>Các cổng vùng nằm trong Giao Hội. Hoàn thành nhiệm vụ bên trái để mở đấu trường. Trò chuyện bằng khung chat ở góc dưới.</p><div class="modal-actions"><button id="logout" class="secondary">Đăng xuất</button></div>`;
    $('#logout').onclick = async () => { await fetch('/api/logout',{method:'POST',headers:{Authorization:`Bearer ${token}`}}); localStorage.removeItem('machgioi_token'); token=null; ws?.close(); state=null; closePanel(); setAuthVisible(true); };
  }
  root.querySelectorAll('[data-next]').forEach(button => button.onclick = () => panel(button.dataset.next));
}

function movement() {
  if (openPanelName || document.activeElement === $('#chat-input')) return { dx:0,dy:0 };
  const dx = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft')) + touch.dx;
  const dy = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup')) + touch.dy;
  const len = Math.hypot(dx,dy);
  return len > 1 ? { dx:dx/len,dy:dy/len } : { dx,dy };
}

function action(type) { send({ type }); }
function loop() { render(state); requestAnimationFrame(loop); }

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && openPanelName) return closePanel();
  if (document.activeElement?.tagName === 'INPUT') return;
  const key=event.key.toLowerCase();
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key)) event.preventDefault();
  keys.add(key);
  if (event.repeat || openPanelName) return;
  if (key === 'j' || key === ' ') action('attack');
  if (key === 'k') action('skill');
  if (key === 'f') action('interact');
  if (key === 'h') action('potion');
  if (key === 'i') panel('inventory');
  if (key === 'enter') $('#chat-input').focus();
});
document.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());
setInterval(() => { const input=movement(); const packed=JSON.stringify(input); if(packed!==lastInput || packed!=='{"dx":0,"dy":0}') { send({type:'input',...input}); lastInput=packed; } }, 50);
setInterval(() => { if(openPanelName==='settings'){const stats=getRenderStats();const readout=$('#perf-readout');if(readout)readout.textContent=`${stats.fps} FPS · đồng bộ ${stats.snapshotMs} ms`; } }, 1000);

$('#auth-form').addEventListener('submit', async event => {
  event.preventDefault(); $('#auth-error').textContent=''; $('#auth-submit').disabled=true;
  try { await auth(registerMode?'register':'login',$('#username').value,$('#password').value); }
  catch(error){$('#auth-error').textContent=error.message;}
  finally{$('#auth-submit').disabled=false}
});
$('#auth-toggle').onclick = () => { registerMode=!registerMode; $('#auth-submit').textContent=registerMode?'Tạo tài khoản':'Vào thế giới'; $('#auth-toggle').textContent=registerMode?'Đã có tài khoản? Đăng nhập':'Chưa có tài khoản? Tạo mới'; };
$('#modal-close').onclick=closePanel;
$('.modal-scrim').onclick=closePanel;
document.querySelectorAll('[data-panel]').forEach(button=>button.onclick=()=>panel(button.dataset.panel));
$('#claim-quest').onclick=()=>action(state?.quest ? 'claimQuest' : 'claimBounty');
for(const type of ['attack','skill','interact','potion']) {
  $(`#action-${type}`).onclick=()=>action(type);
  document.querySelector(`[data-action="${type}"]`).onclick=()=>action(type);
}
$('#chat-form').onsubmit = event => { event.preventDefault(); const input=$('#chat-input'); send({type:'chat',text:input.value}); input.value='';input.blur(); };

const joystick=$('#joystick'),stick=$('#stick');
function updateStick(event){const box=joystick.getBoundingClientRect(),cx=box.left+box.width/2,cy=box.top+box.height/2;const dx=event.clientX-cx,dy=event.clientY-cy,len=Math.hypot(dx,dy)||1,limit=box.width*.31;const factor=Math.min(1,limit/len);const sx=dx*factor,sy=dy*factor;stick.style.transform=`translate(${sx}px,${sy}px)`;touch.dx=sx/limit;touch.dy=sy/limit;}
joystick.addEventListener('pointerdown',event=>{joystick.setPointerCapture(event.pointerId);updateStick(event)});
joystick.addEventListener('pointermove',event=>{if(joystick.hasPointerCapture(event.pointerId))updateStick(event)});
for(const name of ['pointerup','pointercancel']) joystick.addEventListener(name,()=>{touch.dx=0;touch.dy=0;stick.style.transform='translate(0,0)'});

try { const response=await fetch('/api/content'); content=await response.json(); } catch { toast('Không tải được dữ liệu game.'); }
requestAnimationFrame(loop);
if (token) connect(); else setAuthVisible(true);
