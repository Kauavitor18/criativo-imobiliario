import type { Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { currentUser } from './auth-api';

// Optional local import manifest. The manifest and customer images stay outside Git.
export function exemplosApi(): Plugin { return {name:'local-example-import',configureServer(server) {
  server.middlewares.use('/api/exemplos-iniciais', (req,res) => {
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    const user=currentUser(req);
    if (!user || user.status !== 'approved') {res.statusCode=401;return res.end(JSON.stringify({error:'Entre novamente.'}));}
    if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({error:'Método não permitido.'}));}
    try {
      const manifest=JSON.parse(readFileSync(join(process.cwd(),'.local','exemplos-iniciais.json'),'utf8'));
      const profiles=manifest.userId === user.id && Array.isArray(manifest.profiles) ? manifest.profiles : [];
      return res.end(JSON.stringify({profiles}));
    } catch { return res.end(JSON.stringify({profiles:[]})); }
  });
} }; }
