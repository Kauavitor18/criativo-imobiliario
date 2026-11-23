import type { Plugin } from 'vite';
import { readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { currentUser } from './auth-api';

const validFolder = (s: string) => /^[a-zA-Z0-9_-]+-[a-f0-9]{8}$/.test(s);
const validFile = (s: string) => /^referencia-[1-8]\.(png|jpg|webp)$/.test(s);
function ownerFolder(folder: string, userId: number) {
  if (!validFolder(folder)) throw new Error('Pasta de referências inválida.');
  const path = join(process.cwd(), '.local', 'referencias-clientes', folder);
  let owner: { userId?: number };
  try { owner = JSON.parse(readFileSync(join(path, 'owner.json'), 'utf8')); }
  catch { throw new Error('Este cadastro antigo não tem vínculo verificado. Cadastre as referências novamente.'); }
  if (owner.userId !== userId) throw new Error('Referências indisponíveis para esta conta.');
  return path;
}
export function clientApi(): Plugin { return { name: 'client-local-api', configureServer(server) {
  server.middlewares.use('/api/clientes/referencias', async (req, res) => {
    const send = (status: number, value: unknown) => { res.statusCode=status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(value)); };
    const user = currentUser(req);
    if (!user || user.status !== 'approved') return send(401, { error:'Entre novamente para editar o cliente.' });
    try {
      if (req.method === 'POST') {
        const incoming = new Request('http://localhost/api', { method:'POST', headers:req.headers as HeadersInit, body:Readable.toWeb(req) as ReadableStream, duplex:'half' } as RequestInit);
        const data = await incoming.formData(); const folder=String(data.get('folder') || ''); const path=ownerFolder(folder,user.id);
        const images=data.getAll('references').filter((item): item is File => item instanceof File && item.size > 0);
        const existing=readdirSync(path).filter(validFile);
        if (!images.length || existing.length+images.length>8 || images.some(f=>!['image/png','image/jpeg','image/webp'].includes(f.type) || f.size>10*1024*1024)) return send(400,{error:'Selecione imagens PNG, JPG ou WebP de até 10 MB, respeitando o limite de 8 referências por cliente.'});
        const used=new Set(existing.map(f=>Number(/^referencia-(\d)/.exec(f)?.[1])));
        // Read all files before the first write to avoid a partial batch on read errors.
        const payload = await Promise.all(images.map(async file=>({type:file.type,bytes:Buffer.from(await file.arrayBuffer())})));
        const created:string[]=[];
        try {
          for (const item of payload) { const n=Array.from({length:8},(_,i)=>i+1).find(i=>!used.has(i))!; used.add(n); const ext=({'image/png':'png','image/jpeg':'jpg','image/webp':'webp'} as Record<string,string>)[item.type]; const name=`referencia-${n}.${ext}`; writeFileSync(join(path,name),item.bytes,{flag:'wx'}); created.push(name); }
        } catch (error) { for (const name of created) { try { unlinkSync(join(path,name)); } catch {} } throw error; }
        return send(200,{files:created});
      }
      if (req.method === 'DELETE') {
        const url=new URL(req.url || '/', 'http://localhost'); const folder=url.searchParams.get('folder') || ''; const file=url.searchParams.get('file') || '';
        if (!validFile(file)) return send(400,{error:'Referência inválida.'});
        const path=ownerFolder(folder,user.id); unlinkSync(join(path,file)); return send(200,{ok:true});
      }
      return send(405,{error:'Método não permitido.'});
    } catch (error) { return send(400,{error:error instanceof Error ? error.message : 'Não foi possível atualizar as referências.'}); }
  });
} }; }
