import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RACES } from '../server/content.mjs';

const username = process.argv[2];
if (!username || !/^[A-Za-z0-9_]{3,18}$/.test(username)) throw new Error('Dùng: node scripts/prepare-test-account.mjs <tên tài khoản>');
const dataDir = process.env.GAME_DATA_DIR ? resolve(process.env.GAME_DATA_DIR) : resolve(dirname(fileURLToPath(import.meta.url)), '../data');
const db = new DatabaseSync(join(dataDir, 'game.sqlite'));
const account = db.prepare('SELECT id, username FROM accounts WHERE username = ?').get(username);
if (!account) throw new Error(`Không tìm thấy tài khoản ${username}.`);
const row = db.prepare('SELECT state FROM profiles WHERE account_id = ?').get(account.id);
if (!row) throw new Error(`Tài khoản ${username} chưa có nhân vật.`);
const before = JSON.parse(row.state);
if (!RACES[before.race]) throw new Error('Nhân vật cần chọn tộc trước khi mở bộ test.');

const backupDir = join(dataDir, 'backups');
mkdirSync(backupDir, { recursive: true });
const backupPath = join(backupDir, `${account.username}-before-test-${Date.now()}.json`);
writeFileSync(backupPath, JSON.stringify(before, null, 2), 'utf8');

const level = Math.max(30, before.level || 1);
const inventory = { ...before.inventory, wood: 999, ore: 999, herb: 999, mob_essence: 999, core_shard: 99, potion: 99 };
const after = {
  ...before, race: before.race, map: 'giao_hoi', x: 800, y: 520,
  level, exp: 0, gold: Math.max(1000000, before.gold || 0), milestone: 2,
  hp: RACES[before.race].hp + (level - 1) * 10, ki: RACES[before.race].ki,
  inventory, weaponStars: 10, questId: 2, questProgress: 0, questReady: false,
  totalWoodGathered: Math.max(5, before.totalWoodGathered || 0),
  storySeen: 2, bountyProgress: 0, bountiesClaimed: before.bountiesClaimed || 0
};
const now = Date.now();
db.exec('BEGIN');
try {
  db.prepare('UPDATE profiles SET state = ?, updated_at = ? WHERE account_id = ?').run(JSON.stringify(after), now, account.id);
  db.prepare('INSERT INTO game_events (account_id, kind, payload, created_at) VALUES (?, ?, ?, ?)').run(account.id, 'LOCAL_TEST_GRANT', JSON.stringify({ backupPath, level, weaponStars: 10, inventory }), now);
  db.exec('COMMIT');
} catch (error) { db.exec('ROLLBACK'); throw error; }
db.close();
console.log(JSON.stringify({ account: account.username, backupPath, level, milestone: after.milestone, questId: after.questId, weaponStars: after.weaponStars, inventory: after.inventory }));
