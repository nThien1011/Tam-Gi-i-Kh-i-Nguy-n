import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dataDir = process.env.GAME_DATA_DIR ? resolve(process.env.GAME_DATA_DIR) : join(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(join(dataDir, 'game.sqlite'));
db.exec(`
  PRAGMA journal_mode=WAL;
  PRAGMA foreign_keys=ON;
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS profiles (
    account_id INTEGER PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS game_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    kind TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

const hashToken = token => createHash('sha256').update(token).digest('hex');
const passwordDigest = (password, salt) => scryptSync(password, salt, 64).toString('hex');

export function createAccount(username, password) {
  const clean = String(username || '').trim();
  if (!/^[A-Za-z0-9_]{3,18}$/.test(clean)) throw new Error('Tên tài khoản cần 3–18 ký tự chữ, số hoặc _.');
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) throw new Error('Mật khẩu cần từ 8 đến 128 ký tự.');
  const salt = randomBytes(16).toString('hex');
  try {
    const result = db.prepare('INSERT INTO accounts (username, salt, password_hash, created_at) VALUES (?, ?, ?, ?)').run(clean, salt, passwordDigest(password, salt), Date.now());
    return { id: Number(result.lastInsertRowid), username: clean };
  } catch (error) {
    if (String(error).includes('UNIQUE')) throw new Error('Tên tài khoản đã được dùng.');
    throw error;
  }
}

export function authenticate(username, password) {
  const account = db.prepare('SELECT * FROM accounts WHERE username = ?').get(String(username || '').trim());
  if (!account || typeof password !== 'string') throw new Error('Tên tài khoản hoặc mật khẩu không đúng.');
  const supplied = Buffer.from(passwordDigest(password, account.salt), 'hex');
  const stored = Buffer.from(account.password_hash, 'hex');
  if (supplied.length !== stored.length || !timingSafeEqual(supplied, stored)) throw new Error('Tên tài khoản hoặc mật khẩu không đúng.');
  return { id: account.id, username: account.username };
}

export function issueSession(accountId) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  db.prepare('INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)').run(hashToken(token), accountId, expiresAt);
  return { token, expiresAt };
}

export function accountForToken(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = db.prepare('SELECT a.id, a.username FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>?').get(hashToken(token), Date.now());
  return row || null;
}

export function revokeSession(token) {
  if (typeof token === 'string') db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(token));
}

export function loadProfile(accountId) {
  const row = db.prepare('SELECT state FROM profiles WHERE account_id=?').get(accountId);
  return row ? JSON.parse(row.state) : null;
}

export function saveProfile(accountId, state) {
  db.prepare(`INSERT INTO profiles (account_id, state, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(account_id) DO UPDATE SET state=excluded.state, updated_at=excluded.updated_at`)
    .run(accountId, JSON.stringify(state), Date.now());
}

export function logEvent(accountId, kind, payload) {
  db.prepare('INSERT INTO game_events (account_id, kind, payload, created_at) VALUES (?, ?, ?, ?)')
    .run(accountId, kind, JSON.stringify(payload), Date.now());
}
