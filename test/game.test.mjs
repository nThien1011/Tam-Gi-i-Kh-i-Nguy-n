import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';

process.env.GAME_DATA_DIR = join(process.cwd(), 'data', `test-${randomBytes(4).toString('hex')}`);
const { createAccount, authenticate, issueSession, accountForToken, loadProfile } = await import('../server/storage.mjs');
const { GameWorld } = await import('../server/world.mjs');

const messages = [];
const socket = { readyState: 1, send: raw => messages.push(JSON.parse(raw)), close() {} };
const account = createAccount('Tester_' + randomBytes(3).toString('hex'), 'strongpass123');

test('account authentication and session', () => {
  assert.equal(authenticate(account.username, 'strongpass123').id, account.id);
  assert.throws(() => authenticate(account.username, 'wrongpass'));
  const session = issueSession(account.id);
  assert.equal(accountForToken(session.token).id, account.id);
  assert.equal(accountForToken('bad'), null);
});

test('race, quest reward and profile persistence', () => {
  const world = new GameWorld();
  const player = world.connect(account, socket);
  assert.equal(player.questId, 1);
  world.handle(account.id, { type: 'chooseRace', race: 'thien_phong' });
  assert.equal(player.race, 'thien_phong');
  assert.equal(player.questReady, true);
  world.handle(account.id, { type: 'claimQuest' });
  assert.equal(player.questId, 2);
  assert.equal(player.gold, 30);
  world.handle(account.id, { type: 'claimQuest' });
  assert.equal(player.gold, 30, 'claiming twice must not award again');
  world.disconnect(account.id, socket);
  assert.equal(loadProfile(account.id).questId, 2);
});

test('gathering, upgrading, combat and quest progression', () => {
  const world = new GameWorld();
  const player = world.connect(account, socket);
  player.questId = 4;
  player.questProgress = 0;
  player.questReady = false;
  player.gold = 100;
  player.inventory.wood = 5;
  player.inventory.ore = 3;
  player.totalWoodGathered = 5;
  world.handle(account.id, { type: 'upgrade' });
  assert.equal(player.weaponStars, 1);
  assert.equal(player.questReady, true);
  const woodAfter = player.inventory.wood;
  world.handle(account.id, { type: 'upgrade' });
  assert.equal(player.inventory.wood, woodAfter, 'second upgrade lacks resources');
  player.map = 'thien_phong';
  const enemy = world.enemies.thien_phong[0];
  player.x = enemy.x; player.y = enemy.y;
  const oldHp = enemy.hp;
  world.handle(account.id, { type: 'attack' });
  assert.ok(enemy.hp < oldHp);
  player.lastSkill = 0;
  const oldKi = player.ki;
  world.handle(account.id, { type: 'skill' });
  assert.ok(player.ki < oldKi);
  world.disconnect(account.id, socket);
});

test('crafting spends materials and quest experience levels up', () => {
  const world = new GameWorld();
  const player = world.connect(account, socket);
  player.inventory.herb = 2;
  player.inventory.mob_essence = 1;
  const priorPotions = player.inventory.potion;
  world.handle(account.id, { type: 'craftPotion' });
  assert.equal(player.inventory.potion, priorPotions + 1);
  assert.equal(player.inventory.herb, 0);
  world.handle(account.id, { type: 'craftPotion' });
  assert.equal(player.inventory.potion, priorPotions + 1, 'materials cannot be spent twice');
  player.level = 1; player.exp = 90; player.questId = 3; player.questReady = true;
  world.handle(account.id, { type: 'claimQuest' });
  assert.equal(player.level, 2);
  assert.equal(player.exp, 60);
  world.disconnect(account.id, socket);
});

test('boss enters second phase and grants reward once to eligible player', () => {
  const world = new GameWorld();
  const player = world.connect(account, socket);
  player.map = 'arena'; player.questId = 5; player.questReady = false; player.questProgress = 0;
  const boss = world.enemies.arena[0];
  const now = Date.now();
  world.damageEnemy(player, boss, 760, now);
  assert.equal(boss.phase, 2);
  assert.equal(world.enemies.arena.filter(e => e.kind === 'wisp').length, 3);
  world.damageEnemy(player, boss, 740, now + 1);
  assert.equal(boss.alive, false);
  assert.equal(player.questReady, true);
  assert.equal(player.inventory.core_shard >= 1, true);
  const rewardedGold = player.gold;
  world.damageEnemy(player, boss, 10, now + 2);
  assert.equal(player.gold, rewardedGold, 'boss reward must not duplicate');
  world.disconnect(account.id, socket);
});

test('repeatable bounty claims once per 25 kills and persists progress', () => {
  const world = new GameWorld();
  const player = world.connect(account, socket);
  player.milestone = 2; player.bountyProgress = 24; player.map = 'thien_phong';
  const enemy = world.enemies.thien_phong[0];
  world.damageEnemy(player, enemy, enemy.hp, Date.now());
  assert.equal(player.bountyProgress, 25);
  const before = player.gold;
  world.handle(account.id, { type: 'claimBounty' });
  assert.equal(player.bountyProgress, 0);
  assert.equal(player.bountiesClaimed, 1);
  assert.equal(player.gold, before + 160);
  world.handle(account.id, { type: 'claimBounty' });
  assert.equal(player.gold, before + 160);
  world.disconnect(account.id, socket);
});

test('nearby players see combat animations from the same map', () => {
  const world = new GameWorld();
  const first = world.connect(account, socket);
  const otherAccount = createAccount('Viewer_' + randomBytes(3).toString('hex'), 'strongpass123');
  const otherMessages = [];
  const otherSocket = { readyState: 1, send: raw => otherMessages.push(JSON.parse(raw)), close() {} };
  const second = world.connect(otherAccount, otherSocket);
  world.chooseRace(second, 'am_moc');
  first.map = 'thien_phong'; second.map = 'thien_phong';
  const enemy = world.enemies.thien_phong[0];
  first.x = enemy.x; first.y = enemy.y;
  second.x = enemy.x + 30; second.y = enemy.y;
  const firstMessageCount = messages.length;
  world.handle(first.id, { type: 'attack' });
  assert.ok(otherMessages.some(message => message.type === 'effect' && message.kind === 'slash' && message.actorId === first.id));
  assert.ok(otherMessages.some(message => message.type === 'effect' && message.kind === 'damage' && message.enemyId === enemy.id));
  assert.ok(messages.slice(firstMessageCount).some(message => message.type === 'cooldown' && message.action === 'attack'));
  world.disconnect(first.id, socket);
  world.disconnect(second.id, otherSocket);
});

test('milestone two keeps arena available while replaying early quests', () => {
  const world = new GameWorld();
  const player = world.connect(account, socket);
  player.map = 'giao_hoi'; player.x = 1290; player.y = 820;
  player.questId = 2; player.milestone = 1;
  world.handle(player.id, { type: 'interact' });
  assert.equal(player.map, 'giao_hoi');
  player.milestone = 2;
  world.handle(player.id, { type: 'interact' });
  assert.equal(player.map, 'arena');
  world.disconnect(account.id, socket);
});
