import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { accountForToken, authenticate, createAccount, issueSession, revokeSession } from './storage.mjs';
import { ITEMS, MAPS, QUESTS, RACES, SHOP, STORY } from './content.mjs';
import { GameWorld } from './world.mjs';

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const world = new GameWorld();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const sendJson = (res, status, value) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
};

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 10000) throw new Error('Yêu cầu quá lớn.');
  }
  try { return JSON.parse(raw || '{}'); } catch { throw new Error('Dữ liệu JSON không hợp lệ.'); }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (url.pathname === '/api/content' && req.method === 'GET') return sendJson(res, 200, { races: RACES, maps: MAPS, items: ITEMS, quests: QUESTS, shop: SHOP, story: STORY });
    if (url.pathname === '/api/health' && req.method === 'GET') return sendJson(res, 200, { ok: true, players: world.players.size });
    if (url.pathname === '/api/auth' && req.method === 'POST') {
      const body = await readJson(req);
      const account = body.mode === 'register' ? createAccount(body.username, body.password) : authenticate(body.username, body.password);
      return sendJson(res, 200, { account, ...issueSession(account.id) });
    }
    if (url.pathname === '/api/logout' && req.method === 'POST') {
      const token = String(req.headers.authorization || '').replace(/^Bearer /, '');
      revokeSession(token);
      return sendJson(res, 200, { ok: true });
    }
    if (url.pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'Không tìm thấy API.' });
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const filePath = resolve(publicDir, `.${pathname}`);
    if (filePath !== publicDir && !filePath.startsWith(publicDir + sep)) return sendJson(res, 403, { error: 'Đường dẫn không hợp lệ.' });
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') return sendJson(res, 404, { error: 'Không tìm thấy.' });
    if (req.url?.startsWith('/api/')) return sendJson(res, 400, { error: error.message });
    console.error(error);
    sendJson(res, 500, { error: 'Lỗi máy chủ.' });
  }
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 2048 });
server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname !== '/ws') return socket.destroy();
  const account = accountForToken(url.searchParams.get('token'));
  if (!account) { socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n'); return socket.destroy(); }
  wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, account));
});

wss.on('connection', (socket, account) => {
  world.connect(account, socket);
  socket.on('message', raw => {
    try { world.handle(account.id, JSON.parse(raw.toString())); }
    catch { world.notice(account.id, 'Dữ liệu gửi lên không hợp lệ.'); }
  });
  socket.on('close', () => world.disconnect(account.id, socket));
  socket.on('error', error => console.warn('WebSocket:', error.message));
});

let lastTick = Date.now();
const timer = setInterval(() => {
  const now = Date.now();
  const dt = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  world.tick(dt, now);
}, 50);

function shutdown() {
  clearInterval(timer);
  world.shutdown();
  wss.close();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
server.listen(port, host, () => console.log(`Mạch Giới Online: http://${host}:${port}`));
