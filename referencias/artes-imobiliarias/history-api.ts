import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { Plugin } from 'vite';
import { currentUser } from './auth-api';

let db: DatabaseSync;
function database() {
  if (!db) {
    mkdirSync('.local', { recursive: true });
    db = new DatabaseSync('.local/history.sqlite');
    db.exec('CREATE TABLE IF NOT EXISTS artworks (id TEXT PRIMARY KEY, owner INTEGER NOT NULL, created TEXT NOT NULL, metadata TEXT NOT NULL, image BLOB NOT NULL)');
    const columns = db.prepare('PRAGMA table_info(artworks)').all() as {name:string}[];
    if (!columns.some(column => column.name === 'draft')) db.exec('ALTER TABLE artworks ADD COLUMN draft TEXT');
  }
  return db;
}
async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of req) { const b=Buffer.from(chunk); size+=b.length; if(size>48*1024*1024) throw new Error('Imagem muito grande para o histórico.'); chunks.push(b); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export function historyApi(): Plugin { return { name:'local-art-history', configureServer(server) {
  server.middlewares.use('/api/historico', async (req,res) => {
    const send=(status:number,value:unknown)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(value));};
    const user=currentUser(req); if(!user || user.status!=='approved') return send(401,{error:'Entre novamente para acessar o histórico.'});
    const url=new URL(req.url || '/', 'http://localhost'); const match=/^\/([a-f0-9-]{36})(\/(?:imagem|rascunho))?$/.exec(url.pathname);
    try {
      if(req.method==='GET' && url.pathname==='/') {
        const rows=database().prepare('SELECT metadata FROM artworks WHERE owner=? ORDER BY created DESC').all(user.id) as {metadata:string}[];
        return send(200,{entries:rows.map(row=>JSON.parse(row.metadata))});
      }
      if(req.method==='GET' && match?.[2]==='/rascunho') {
        const row=database().prepare('SELECT draft FROM artworks WHERE id=? AND owner=?').get(match[1],user.id) as {draft:string|null}|undefined;
        if(!row) return send(404,{error:'Arte não encontrada.'});
        return send(200,{draft:row.draft ? JSON.parse(row.draft) : null});
      }
      if(req.method==='GET' && match?.[2]==='/imagem') {
        const row=database().prepare('SELECT image FROM artworks WHERE id=? AND owner=?').get(match[1],user.id) as {image:Uint8Array}|undefined;
        if(!row)return send(404,{error:'Arte não encontrada.'});
        res.setHeader('Content-Type','image/png'); res.setHeader('Cache-Control','private, no-store'); return res.end(Buffer.from(row.image));
      }
      if(req.method==='POST' && url.pathname==='/') {
        const input=await readBody(req); const image=typeof input.image==='string' && /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(input.image);
        if(!image)return send(400,{error:'A imagem precisa estar no formato PNG.'});
        const bytes=Buffer.from(image[1],'base64'); if(bytes.length>16*1024*1024 || !bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return send(400,{error:'Imagem PNG inválida ou maior que 16 MB.'});
        const string=(v:unknown,max:number)=>typeof v==='string'?v.slice(0,max):'';
        const id=randomUUID(); const created=new Date().toISOString();
        const entry={id,created,date:new Date(created).toLocaleString('pt-BR'),description:string(input.description,5000),segment:string(input.segment,100),format:string(input.format,100),profileId:string(input.profileId,100),profileName:string(input.profileName,200),title:string(input.title,500),professional:string(input.professional,500),referenceFile:string(input.referenceFile,100),referenceLabel:string(input.referenceLabel,100),warnings:Array.isArray(input.warnings)?input.warnings.filter((v:unknown)=>typeof v==='string').slice(0,30).map((v:string)=>v.slice(0,1000)):[],savedImage:true};
        const draft=input.draft;
        const validSource=(v:unknown)=>typeof v==='string' && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v) && v.length <= 14*1024*1024;
        if(draft && (!validSource(draft.photo) || (draft.logo && !validSource(draft.logo)) || !draft.plan || typeof draft.plan !== 'object' || JSON.stringify(draft.plan).length > 100000)) return send(400,{error:'Dados de edição inválidos ou maiores que o limite.'});
        database().prepare('INSERT INTO artworks(id,owner,created,metadata,image,draft) VALUES(?,?,?,?,?,?)').run(id,user.id,created,JSON.stringify(entry),bytes,draft ? JSON.stringify(draft) : null);
        return send(201,{entry});
      }
      if(req.method==='DELETE' && match && !match[2]) {
        const result=database().prepare('DELETE FROM artworks WHERE id=? AND owner=?').run(match[1],user.id);
        return result.changes?send(200,{ok:true}):send(404,{error:'Arte não encontrada.'});
      }
      return send(404,{error:'Rota não encontrada.'});
    } catch { return send(400,{error:'Não foi possível acessar o histórico. Verifique a imagem e tente novamente.'}); }
  });
} }; }
