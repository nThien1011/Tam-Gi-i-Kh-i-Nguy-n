import { MAPS, RACES, QUESTS, WORLD_SIZE } from './content.mjs';
import { loadProfile, saveProfile, logEvent } from './storage.mjs';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const randomPosition = (seed, i) => ({ x: 220 + ((seed * 173 + i * 277) % 1150), y: 180 + ((seed * 211 + i * 193) % 610) });
const nearbyForBoss = (players, boss) => [...players.values()].filter(p => p.map === 'arena' && p.race && distance(p, boss) < 420).sort((a, b) => distance(a, boss) - distance(b, boss))[0];

function defaultProfile(account) {
  return {
    id: account.id, name: account.username, race: null, map: 'giao_hoi', x: 800, y: 520,
    level: 1, exp: 0, gold: 0, milestone: 1, hp: 120, ki: 100,
    inventory: { wood: 0, ore: 0, herb: 0, mob_essence: 0, core_shard: 0, potion: 3 },
    weaponStars: 0, questId: 1, questProgress: 0, questReady: false, totalWoodGathered: 0,
    storySeen: 0, bountyProgress: 0, bountiesClaimed: 0
  };
}

function makeObjects() {
  const enemies = {};
  const resources = {};
  for (const [mapId, map] of Object.entries(MAPS)) {
    enemies[mapId] = [];
    resources[mapId] = [];
    if (mapId !== 'giao_hoi' && mapId !== 'arena') {
      for (let i = 0; i < 9; i++) {
        const pos = randomPosition(Object.keys(MAPS).indexOf(mapId) + 2, i);
        enemies[mapId].push({ id: `${mapId}-mob-${i}`, kind: mapId, x: pos.x, y: pos.y, homeX: pos.x, homeY: pos.y, hp: 90 + i * 8, maxHp: 90 + i * 8, alive: true, respawnAt: 0, lastAttack: 0, target: null });
      }
    }
    if (mapId === 'arena') enemies[mapId].push({ id: 'guardian', kind: 'boss', x: 800, y: 360, homeX: 800, homeY: 360, hp: 1500, maxHp: 1500, alive: true, respawnAt: 0, lastAttack: 0, target: null, phase: 1, nextAbilityAt: 0, warningAt: 0, contributions: {} });
    if (mapId !== 'arena') {
      for (let i = 0; i < (mapId === 'giao_hoi' ? 10 : 18); i++) {
        const seed = Object.keys(MAPS).indexOf(mapId) + 7;
        let pos = randomPosition(seed, i);
        for (let attempt = 1; attempt < 35; attempt++) {
          const occupied = [...enemies[mapId], ...resources[mapId], ...map.portals, ...map.npcs];
          if (!occupied.some(object => distance(pos, object) < 95)) break;
          pos = randomPosition(seed + attempt * 13, i + attempt * 19);
        }
        const kind = i % 3 === 0 ? 'ore' : i % 4 === 0 ? 'herb' : 'wood';
        resources[mapId].push({ id: `${mapId}-resource-${i}`, kind, x: pos.x, y: pos.y, active: true, respawnAt: 0 });
      }
    }
  }
  return { enemies, resources };
}

export class GameWorld {
  constructor() {
    this.players = new Map();
    this.sockets = new Map();
    this.inputs = new Map();
    const objects = makeObjects();
    this.enemies = objects.enemies;
    this.resources = objects.resources;
    this.lastSave = Date.now();
    this.lastBroadcast = 0;
  }

  connect(account, socket) {
    const oldSocket = this.sockets.get(account.id);
    if (oldSocket) oldSocket.close(4001, 'Đăng nhập ở nơi khác');
    let player = loadProfile(account.id) || defaultProfile(account);
    player.id = account.id;
    player.name = account.username;
    if (!MAPS[player.map]) player.map = 'giao_hoi';
    player.bountyProgress ??= 0;
    player.bountiesClaimed ??= 0;
    player.x = clamp(Number(player.x) || 800, 60, WORLD_SIZE.width - 60);
    player.y = clamp(Number(player.y) || 520, 60, WORLD_SIZE.height - 60);
    player.lastAttack = 0;
    player.lastSkill = 0;
    player.invulnerableUntil = 0;
    this.players.set(account.id, player);
    this.sockets.set(account.id, socket);
    this.inputs.set(account.id, { dx: 0, dy: 0 });
    this.send(account.id, { type: 'welcome', id: account.id, story: player.storySeen ? null : 0 });
    this.snapshot(account.id);
    this.notice(account.id, `Chào mừng ${player.name} đến Mạch Giới.`);
    return player;
  }

  disconnect(accountId, socket) {
    if (this.sockets.get(accountId) !== socket) return;
    const player = this.players.get(accountId);
    if (player) this.persist(player);
    this.players.delete(accountId);
    this.sockets.delete(accountId);
    this.inputs.delete(accountId);
  }

  persist(player) {
    const { lastAttack, lastSkill, invulnerableUntil, ...saved } = player;
    saveProfile(player.id, saved);
  }

  send(accountId, payload) {
    const socket = this.sockets.get(accountId);
    if (socket?.readyState === 1) socket.send(JSON.stringify(payload));
  }

  emitMap(mapId, payload) {
    for (const player of this.players.values()) if (player.map === mapId) this.send(player.id, payload);
  }

  notice(accountId, text) { this.send(accountId, { type: 'notice', text }); }

  handle(accountId, message) {
    const player = this.players.get(accountId);
    if (!player || typeof message !== 'object' || !message) return;
    const now = Date.now();
    switch (message.type) {
      case 'input': {
        let dx = clamp(Number(message.dx) || 0, -1, 1);
        let dy = clamp(Number(message.dy) || 0, -1, 1);
        const length = Math.hypot(dx, dy);
        if (length > 1) { dx /= length; dy /= length; }
        this.inputs.set(accountId, { dx, dy });
        break;
      }
      case 'chooseRace': this.chooseRace(player, message.race); break;
      case 'attack': this.attack(player, now); break;
      case 'skill': this.skill(player, now); break;
      case 'interact': this.interact(player, now); break;
      case 'upgrade': this.upgrade(player); break;
      case 'craftPotion': this.craftPotion(player); break;
      case 'potion': this.potion(player); break;
      case 'claimQuest': this.claimQuest(player); break;
      case 'claimBounty': this.claimBounty(player); break;
      case 'storySeen': player.storySeen = Math.max(player.storySeen || 0, Number(message.chapter) + 1 || 1); this.persist(player); break;
      case 'chat': this.chat(player, message.text); break;
    }
  }

  chooseRace(player, raceId) {
    if (player.race || !RACES[raceId]) return;
    player.race = raceId;
    player.hp = RACES[raceId].hp;
    player.ki = RACES[raceId].ki;
    player.questProgress = 1;
    player.questReady = true;
    this.persist(player);
    logEvent(player.id, 'RACE_CHOSEN', { raceId });
    this.notice(player.id, `Bạn đã gia nhập ${RACES[raceId].name}. Nhận thưởng nhiệm vụ để tiếp tục.`);
    this.snapshot(player.id);
  }

  attack(player, now) {
    if (!player.race || now - player.lastAttack < 550) return;
    const enemy = this.nearestEnemy(player, 112);
    if (!enemy) return this.notice(player.id, 'Không có mục tiêu trong tầm đánh.');
    player.lastAttack = now;
    this.damageEnemy(player, enemy, RACES[player.race].attack + player.weaponStars * 5, now);
    this.emitMap(player.map, { type: 'effect', kind: 'slash', actorId: player.id, x: enemy.x, y: enemy.y });
    this.send(player.id, { type: 'cooldown', action: 'attack', ms: 550 });
  }

  skill(player, now) {
    if (!player.race || now - player.lastSkill < (player.race === 'hoa_hac' ? 4000 : 7000)) return;
    const cost = player.race === 'am_moc' ? 22 : player.race === 'hoa_hac' ? 16 : 25;
    if (player.ki < cost) return this.notice(player.id, 'Không đủ KI.');
    const targets = this.enemies[player.map].filter(enemy => enemy.alive && distance(player, enemy) < (player.race === 'hoa_hac' ? 160 : 230));
    if (player.race !== 'am_moc' && targets.length === 0) return this.notice(player.id, 'Không có mục tiêu trong tầm kỹ năng.');
    player.ki -= cost;
    player.lastSkill = now;
    this.send(player.id, { type: 'cooldown', action: 'skill', ms: player.race === 'hoa_hac' ? 4000 : 7000 });
    if (player.race === 'am_moc') {
      const allies = [...this.players.values()].filter(other => other.map === player.map && distance(player, other) < 180 && other.race);
      const ally = allies.sort((a, b) => a.hp / (RACES[a.race].hp + (a.level - 1) * 10) - b.hp / (RACES[b.race].hp + (b.level - 1) * 10))[0] || player;
      const priorHp = ally.hp;
      ally.hp = Math.min(RACES[ally.race].hp + (ally.level - 1) * 10, ally.hp + 46);
      this.emitMap(player.map, { type: 'effect', kind: 'heal', actorId: player.id, x: ally.x, y: ally.y, value: Math.round(ally.hp - priorHp) });
      const boss = this.enemies.arena[0];
      if (player.map === 'arena' && boss.alive && distance(player, boss) < 500) boss.contributions[player.id] = (boss.contributions[player.id] || 0) + (ally.hp - priorHp);
    } else if (player.race === 'thien_phong') {
      const target = targets.sort((a, b) => distance(player, a) - distance(player, b))[0];
      this.damageEnemy(player, target, 42 + RACES[player.race].attack * 2 + player.weaponStars * 8, now);
      this.emitMap(player.map, { type: 'effect', kind: 'lightning', actorId: player.id, x: target.x, y: target.y });
    } else {
      for (const target of targets) this.damageEnemy(player, target, 24 + player.weaponStars * 6, now);
      this.emitMap(player.map, { type: 'effect', kind: 'fire', actorId: player.id, x: player.x, y: player.y });
    }
    if (player.questId === 2) this.advanceQuest(player, 1);
  }

  nearestEnemy(player, range) {
    return this.enemies[player.map].filter(enemy => enemy.alive && distance(player, enemy) <= range).sort((a, b) => distance(player, a) - distance(player, b))[0];
  }

  damageEnemy(player, enemy, amount, now) {
    if (!enemy.alive) return;
    const dealt = Math.min(enemy.hp, amount);
    enemy.hp = Math.max(0, enemy.hp - amount);
    enemy.target = player.id;
    if (enemy.kind === 'boss') enemy.contributions[player.id] = (enemy.contributions[player.id] || 0) + dealt;
    this.emitMap(player.map, { type: 'effect', kind: 'damage', enemyId: enemy.id, x: enemy.x, y: enemy.y, value: dealt });
    if (enemy.hp > 0) {
      if (enemy.kind === 'boss' && enemy.phase === 1 && enemy.hp <= enemy.maxHp / 2) {
        enemy.phase = 2;
        for (let i = 0; i < 3; i++) {
          const x = 610 + i * 190, y = 440 + (i % 2) * 80;
          this.enemies.arena.push({ id: `wisp-${now}-${i}`, kind: 'wisp', x, y, homeX: x, homeY: y, hp: 110, maxHp: 110, alive: true, respawnAt: Infinity, lastAttack: 0, target: null });
        }
        for (const other of this.players.values()) if (other.map === 'arena') this.notice(other.id, 'Thủ Hộ Tam Giới bước sang giai đoạn 2 và gọi ba Hư Ảnh!');
      }
      return;
    }
    enemy.alive = false;
    enemy.respawnAt = now + (enemy.kind === 'boss' ? 30000 : 15000);
    enemy.target = null;
    const recipients = enemy.kind === 'boss'
      ? [...this.players.values()].filter(other => other.map === 'arena' && (enemy.contributions[other.id] || 0) >= 75)
      : [player];
    for (const recipient of recipients) {
      recipient.gold += enemy.kind === 'boss' ? 80 : 6;
      recipient.exp += enemy.kind === 'boss' ? 120 : 15;
      recipient.inventory.mob_essence += enemy.kind === 'boss' ? 4 : 1;
      if (recipient.race === 'hoa_hac') recipient.ki = Math.min(RACES[recipient.race].ki, recipient.ki + 4);
      while (recipient.exp >= recipient.level * 100) { recipient.exp -= recipient.level * 100; recipient.level++; this.notice(recipient.id, `Lên cấp ${recipient.level}!`); }
      if (enemy.kind === 'boss') {
        recipient.inventory.core_shard += 1;
        if (recipient.questId === 5) this.advanceQuest(recipient, 1);
        this.notice(recipient.id, 'Thủ Hộ Tam Giới đã ngã xuống. Dấu ấn Vô Mạch hiện ra...');
        this.send(recipient.id, { type: 'story', chapter: 1 });
      } else {
        if (recipient.questId === 3) this.advanceQuest(recipient, 1);
        if (recipient.milestone >= 2) recipient.bountyProgress = Math.min(25, recipient.bountyProgress + 1);
      }
      logEvent(recipient.id, 'ENEMY_DEFEATED', { enemy: enemy.id, gold: recipient.gold });
      this.persist(recipient);
    }
    if (enemy.kind === 'boss') {
      for (const other of this.players.values()) if (other.map === 'arena' && !recipients.includes(other)) this.notice(other.id, 'Boss đã ngã xuống. Cần đóng góp ít nhất 5% để nhận thưởng.');
    }
  }

  interact(player, now) {
    const portal = MAPS[player.map].portals.find(p => distance(player, p) < 95);
    if (portal) {
      if (portal.quest && player.questId < portal.quest && player.milestone < 2) return this.notice(player.id, 'Hãy hoàn thành chuỗi nhiệm vụ trước khi vào đấu trường.');
      player.map = portal.to;
      [player.x, player.y] = MAPS[portal.to].spawn;
      this.inputs.set(player.id, { dx: 0, dy: 0 });
      this.persist(player);
      this.snapshot(player.id);
      this.notice(player.id, `Đã tới ${MAPS[portal.to].name}.`);
      return;
    }
    const npc = MAPS[player.map].npcs.find(n => distance(player, n) < 100);
    if (npc) {
      if (npc.role === 'guide' && !player.race) this.send(player.id, { type: 'openPanel', panel: 'race' });
      else if (npc.role === 'smith') this.send(player.id, { type: 'openPanel', panel: 'forge' });
      else this.notice(player.id, npc.role === 'guide' ? 'Ba mạch đang mất cân bằng. Hãy theo dấu nhiệm vụ của bạn.' : 'Mỗi tộc có con đường riêng. Hãy rèn kỹ năng và đối mặt với dị thú.');
      return;
    }
    const node = this.resources[player.map].filter(r => r.active && distance(player, r) < 100).sort((a, b) => distance(player, a) - distance(player, b))[0];
    if (!node) return this.notice(player.id, 'Không có vật thể nào để tương tác gần bạn.');
    node.active = false;
    node.respawnAt = now + 20000;
    player.inventory[node.kind] += 1;
    if (node.kind === 'wood') player.totalWoodGathered++;
    player.exp += 3;
    while (player.exp >= player.level * 100) { player.exp -= player.level * 100; player.level++; this.notice(player.id, `Lên cấp ${player.level}!`); }
    if (player.questId === 4 && player.totalWoodGathered >= 5 && player.weaponStars >= 1) this.advanceQuest(player, 1);
    this.emitMap(player.map, { type: 'effect', kind: 'gather', actorId: player.id, x: node.x, y: node.y });
    this.notice(player.id, `Thu thập +1 ${node.kind === 'wood' ? 'gỗ' : node.kind === 'ore' ? 'quặng' : 'lá hồi sinh'}.`);
    this.persist(player);
  }

  upgrade(player) {
    if (!player.race) return;
    if (player.weaponStars >= 10) return this.notice(player.id, 'Vũ khí đã đạt 10 sao trong bản chơi hiện tại.');
    const costWood = 3 + player.weaponStars * 4;
    const costOre = 2 + player.weaponStars * 3;
    const costGold = 30 + player.weaponStars * 80;
    const costShard = player.weaponStars >= 3 ? Math.ceil((player.weaponStars - 2) / 2) : 0;
    if (player.inventory.wood < costWood || player.inventory.ore < costOre || player.gold < costGold || player.inventory.core_shard < costShard) return this.notice(player.id, `Cần ${costWood} gỗ, ${costOre} quặng, ${costGold} Đồng Linh${costShard ? ` và ${costShard} mảnh lõi` : ''}.`);
    player.inventory.wood -= costWood;
    player.inventory.ore -= costOre;
    player.gold -= costGold;
    player.inventory.core_shard -= costShard;
    player.weaponStars++;
    if (player.questId === 4 && player.totalWoodGathered >= 5) this.advanceQuest(player, 1);
    logEvent(player.id, 'WEAPON_UPGRADED', { stars: player.weaponStars, costWood, costOre, costGold, costShard });
    this.persist(player);
    this.notice(player.id, `Vũ khí đã lên ${player.weaponStars} sao!`);
  }

  potion(player) {
    if (player.inventory.potion < 1 || !player.race) return;
    const maxHp = RACES[player.race].hp + (player.level - 1) * 10;
    if (player.hp >= maxHp) return;
    player.inventory.potion--;
    player.hp = Math.min(maxHp, player.hp + 60);
    this.persist(player);
  }

  craftPotion(player) {
    if (!player.race) return;
    if (player.inventory.herb < 2 || player.inventory.mob_essence < 1) return this.notice(player.id, 'Cần 2 lá hồi sinh và 1 tinh chất dị thú để chế bình hồi phục.');
    player.inventory.herb -= 2;
    player.inventory.mob_essence -= 1;
    player.inventory.potion += 1;
    logEvent(player.id, 'POTION_CRAFTED', { herb: 2, mob_essence: 1 });
    this.persist(player);
    this.notice(player.id, 'Đã chế tạo 1 bình hồi phục.');
  }

  advanceQuest(player, amount) {
    if (player.questReady || player.questId > QUESTS.length) return;
    const quest = QUESTS[player.questId - 1];
    player.questProgress = Math.min(quest.target, player.questProgress + amount);
    if (player.questProgress >= quest.target) {
      player.questReady = true;
      this.notice(player.id, `Đã hoàn thành: ${quest.title}. Nhận thưởng trong bảng nhiệm vụ.`);
    }
  }

  claimQuest(player) {
    if (!player.questReady || player.questId > QUESTS.length) return;
    const quest = QUESTS[player.questId - 1];
    player.gold += quest.reward.gold;
    player.exp += quest.reward.exp;
    while (player.exp >= player.level * 100) { player.exp -= player.level * 100; player.level++; this.notice(player.id, `Lên cấp ${player.level}!`); }
    if (quest.reward.item) player.inventory[quest.reward.item]++;
    logEvent(player.id, 'QUEST_REWARD', { questId: quest.id, reward: quest.reward });
    player.questId++;
    player.questProgress = 0;
    player.questReady = false;
    if (quest.id === 5) { player.milestone = 2; this.send(player.id, { type: 'story', chapter: 1 }); }
    this.persist(player);
    this.notice(player.id, `Nhận thưởng: ${quest.title}.`);
  }

  claimBounty(player) {
    if (player.milestone < 2 || player.bountyProgress < 25) return;
    player.bountyProgress = 0;
    player.bountiesClaimed++;
    player.gold += 160;
    player.exp += 180;
    player.inventory.mob_essence += 3;
    player.inventory.core_shard += 1;
    while (player.exp >= player.level * 100) { player.exp -= player.level * 100; player.level++; this.notice(player.id, `Lên cấp ${player.level}!`); }
    logEvent(player.id, 'BOUNTY_REWARD', { contract: player.bountiesClaimed });
    this.persist(player);
    this.notice(player.id, `Đã hoàn thành khế ước săn quái lần ${player.bountiesClaimed}.`);
  }

  chat(player, text) {
    const clean = String(text || '').trim().slice(0, 160).replace(/[<>]/g, '');
    if (!clean) return;
    for (const other of this.players.values()) if (other.map === player.map) this.send(other.id, { type: 'chat', name: player.name, text: clean });
  }

  tick(dt, now) {
    for (const player of this.players.values()) {
      const input = this.inputs.get(player.id) || { dx: 0, dy: 0 };
      player.x = clamp(player.x + input.dx * 210 * dt, 45, WORLD_SIZE.width - 45);
      player.y = clamp(player.y + input.dy * 210 * dt, 65, WORLD_SIZE.height - 45);
      if (player.race) {
        player.ki = Math.min(RACES[player.race].ki, player.ki + 3 * dt);
        if (MAPS[player.map].safe) player.hp = Math.min(RACES[player.race].hp + (player.level - 1) * 10, player.hp + 4 * dt);
      }
    }
    for (const [mapId, group] of Object.entries(this.enemies)) for (const enemy of group) {
      if (!enemy.alive) {
        if (now >= enemy.respawnAt) { enemy.alive = true; enemy.hp = enemy.maxHp; enemy.x = enemy.homeX; enemy.y = enemy.homeY; enemy.phase = 1; enemy.contributions = {}; enemy.nextAbilityAt = 0; enemy.warningAt = 0; if (enemy.kind === 'boss') this.enemies.arena = this.enemies.arena.filter(e => e.kind !== 'wisp'); }
        continue;
      }
      if (enemy.kind === 'boss') {
        if (enemy.warningAt && now >= enemy.warningAt) {
          for (const target of this.players.values()) if (target.map === 'arena' && Math.hypot(target.x - enemy.warningX, target.y - enemy.warningY) < 110 && now > target.invulnerableUntil) {
            target.hp = Math.max(0, target.hp - (enemy.phase === 2 ? 34 : 24));
            this.emitMap('arena', { type: 'effect', kind: 'hurt', actorId: target.id, x: target.x, y: target.y });
            if (target.hp <= 0) {
              target.hp = RACES[target.race].hp; target.ki = RACES[target.race].ki;
              [target.x, target.y] = MAPS.arena.spawn;
              target.invulnerableUntil = now + 3000;
              this.notice(target.id, 'Bạn đã gục ngã và hồi sinh tại cổng đấu trường.');
              this.persist(target);
            }
          }
          enemy.warningAt = 0;
        }
        if (nearbyForBoss(this.players, enemy) && !enemy.warningAt && now >= enemy.nextAbilityAt) {
          const target = nearbyForBoss(this.players, enemy);
          enemy.warningX = target.x; enemy.warningY = target.y;
          enemy.warningAt = now + 1100;
          enemy.nextAbilityAt = now + (enemy.phase === 2 ? 4300 : 6000);
          for (const other of this.players.values()) if (other.map === 'arena') this.send(other.id, { type: 'effect', kind: 'warning', x: enemy.warningX, y: enemy.warningY, duration: 1100 });
        }
      }
      const nearby = [...this.players.values()].filter(p => p.map === mapId && p.race && distance(p, enemy) < (enemy.kind === 'boss' ? 400 : 260)).sort((a, b) => distance(a, enemy) - distance(b, enemy))[0];
      if (nearby) {
        const d = distance(nearby, enemy);
        if (d > 63) { enemy.x += (nearby.x - enemy.x) / d * 55 * dt; enemy.y += (nearby.y - enemy.y) / d * 55 * dt; }
        else if (now - enemy.lastAttack > (enemy.kind === 'boss' ? 1500 : 2100)) {
          enemy.lastAttack = now;
          if (now > nearby.invulnerableUntil) {
            nearby.hp = Math.max(0, nearby.hp - (enemy.kind === 'boss' ? 18 : 8));
            this.emitMap(mapId, { type: 'effect', kind: 'hurt', actorId: nearby.id, x: nearby.x, y: nearby.y });
            if (nearby.hp <= 0) {
              nearby.hp = RACES[nearby.race].hp;
              nearby.ki = RACES[nearby.race].ki;
              [nearby.x, nearby.y] = MAPS[nearby.map].spawn;
              nearby.invulnerableUntil = now + 3000;
              this.notice(nearby.id, 'Bạn đã gục ngã và hồi sinh tại điểm an toàn.');
              this.persist(nearby);
            }
          }
        }
      } else {
        const d = Math.hypot(enemy.homeX - enemy.x, enemy.homeY - enemy.y);
        if (d > 5) { enemy.x += (enemy.homeX - enemy.x) / d * 30 * dt; enemy.y += (enemy.homeY - enemy.y) / d * 30 * dt; }
      }
    }
    for (const group of Object.values(this.resources)) for (const node of group) if (!node.active && now >= node.respawnAt) node.active = true;
    if (now - this.lastBroadcast >= 50) { for (const player of this.players.values()) this.snapshot(player.id); this.lastBroadcast = now; }
    if (now - this.lastSave > 15000) { for (const player of this.players.values()) this.persist(player); this.lastSave = now; }
  }

  snapshot(accountId) {
    const player = this.players.get(accountId);
    if (!player) return;
    const self = { ...player };
    delete self.lastAttack; delete self.lastSkill; delete self.invulnerableUntil;
    const quest = QUESTS[player.questId - 1] || null;
    this.send(accountId, {
      type: 'state', self, map: MAPS[player.map], quest,
      players: [...this.players.values()].filter(p => p.map === player.map).map(p => ({ id: p.id, name: p.name, race: p.race, x: p.x, y: p.y, hp: p.hp, level: p.level })),
      enemies: this.enemies[player.map].filter(e => e.alive).map(e => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, hp: e.hp, maxHp: e.maxHp, phase: e.phase || 1 })),
      resources: this.resources[player.map].filter(r => r.active).map(r => ({ id: r.id, kind: r.kind, x: r.x, y: r.y }))
    });
  }

  shutdown() { for (const player of this.players.values()) this.persist(player); }
}
