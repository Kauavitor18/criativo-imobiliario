import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import type { IncomingMessage } from 'node:http';
import type { Plugin } from 'vite';

type User = { id: number; name: string; email: string; password: string; role: string; status: string };
const sessions = new Map<string, number>();
let db: DatabaseSync;
function database() {
  if (!db) { mkdirSync('.local', { recursive: true }); db = new DatabaseSync('.local/users.sqlite'); db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`); }
  return db;
}
function hash(password: string) { const salt = randomBytes(16).toString('hex'); return salt + ':' + scryptSync(password, salt, 64).toString('hex'); }
function verify(password: string, saved: string) { const [salt, stored] = saved.split(':'); if (!salt || !stored) return false; const expected = Buffer.from(stored, 'hex'); const actual = scryptSync(password, salt, 64); return expected.length === actual.length && timingSafeEqual(expected, actual); }
function publicUser(u: User) { return { id: u.id, name: u.name, email: u.email, role: u.role, status: u.status }; }
export function currentUser(req: IncomingMessage): User | null { const token = /(?:^|;\s*)creative_session=([^;]+)/.exec(req.headers.cookie || '')?.[1]; const id = token && sessions.get(token); if (!id) return null; return database().prepare('SELECT * FROM users WHERE id = ?').get(id) as User || null; }
async function readBody(req: IncomingMessage) { let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 8192) throw new Error('Dados muito grandes.'); } return JSON.parse(raw || '{}'); }
export function authApi(): Plugin { return { name: 'local-auth', configureServer(server) { database(); server.middlewares.use('/api/auth', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const send = (status: number, value: unknown) => { res.statusCode = status; res.end(JSON.stringify(value)); };
  try {
    const route = new URL(req.url || '/', 'http://localhost').pathname;
    if (req.method === 'GET' && route === '/session') { const user = currentUser(req); const admins = database().prepare("SELECT COUNT(*) AS n FROM users WHERE role='admin'").get() as { n: number }; return send(200, { user: user?.status === 'approved' ? publicUser(user) : null, needsSetup: admins.n === 0 }); }
    if (req.method === 'POST' && (route === '/register' || route === '/setup')) {
      const data = await readBody(req); const name = String(data.name || '').trim(); const email = String(data.email || '').trim().toLowerCase(); const password = String(data.password || '');
      if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 6 || password.length > 256) return send(400, { error: 'Preencha nome, e-mail válido e senha com pelo menos 6 caracteres.' });
      const setup = route === '/setup'; const admins = database().prepare("SELECT COUNT(*) AS n FROM users WHERE role='admin'").get() as { n: number }; if (setup && admins.n) return send(403, { error: 'Administrador já configurado.' });
      if (database().prepare('SELECT id FROM users WHERE email=?').get(email)) return send(409, { error: 'Este e-mail já está cadastrado.' });
      database().prepare('INSERT INTO users(name,email,password,role,status) VALUES(?,?,?,?,?)').run(name, email, hash(password), setup ? 'admin' : 'user', setup ? 'approved' : 'pending');
      return send(201, { ok: true, message: setup ? 'Administrador criado. Entre para continuar.' : 'Cadastro enviado para aprovação.' });
    }
    if (req.method === 'POST' && route === '/login') {
      const data = await readBody(req); const email = String(data.email || '').trim().toLowerCase(); const password = String(data.password || '');
      const user = database().prepare('SELECT * FROM users WHERE email=?').get(email) as User | undefined;
      if (!user || !verify(password, user.password)) return send(401, { error: 'E-mail ou senha inválidos.' });
      if (user.status !== 'approved') return send(403, { error: user.status === 'pending' ? 'Seu cadastro aguarda aprovação.' : 'Seu acesso não está autorizado.' });
      const token = randomBytes(32).toString('hex'); sessions.set(token, user.id); res.setHeader('Set-Cookie', `creative_session=${token}; HttpOnly; SameSite=Strict; Path=/`); return send(200, { user: publicUser(user) });
    }
    if (req.method === 'POST' && route === '/logout') { const token = /(?:^|;\s*)creative_session=([^;]+)/.exec(req.headers.cookie || '')?.[1]; if (token) sessions.delete(token); res.setHeader('Set-Cookie', 'creative_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); return send(200, { ok: true }); }
    if (req.method === 'GET' && route === '/users') { const user = currentUser(req); if (!user || user.status !== 'approved' || user.role !== 'admin') return send(403, { error: 'Acesso restrito ao administrador.' }); const rows = database().prepare('SELECT id,name,email,role,status,created_at FROM users ORDER BY created_at DESC').all(); return send(200, { users: rows }); }
    if (req.method === 'POST' && route === '/users') {
      const user = currentUser(req);
      if (!user || user.status !== 'approved' || user.role !== 'admin') return send(403, { error: 'Acesso restrito ao administrador.' });
      const data = await readBody(req); const name = String(data.name || '').trim(); const email = String(data.email || '').trim().toLowerCase(); const password = String(data.password || '');
      if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 6 || password.length > 256) return send(400, { error: 'Preencha nome, e-mail válido e senha com pelo menos 6 caracteres.' });
      if (database().prepare('SELECT id FROM users WHERE email=?').get(email)) return send(409, { error: 'Este e-mail já está cadastrado.' });
      database().prepare('INSERT INTO users(name,email,password,role,status) VALUES(?,?,?,?,?)').run(name, email, hash(password), 'user', 'approved');
      return send(201, { ok: true });
    }
    const match = /^\/users\/(\d+)\/(approve|reject)$/.exec(route);
    if (req.method === 'POST' && match) { const user = currentUser(req); if (!user || user.status !== 'approved' || user.role !== 'admin') return send(403, { error: 'Acesso restrito ao administrador.' }); const outcome = database().prepare("UPDATE users SET status=? WHERE id=? AND role='user' AND status='pending'").run(match[2] === 'approve' ? 'approved' : 'rejected', Number(match[1])); if (!outcome.changes) return send(404, { error: 'Cadastro pendente não encontrado.' }); return send(200, { ok: true }); }
    send(404, { error: 'Rota não encontrada.' });
  } catch { send(400, { error: 'Não foi possível processar a solicitação.' }); }
}); } }; }
