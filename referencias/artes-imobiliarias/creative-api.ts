import type { Plugin } from 'vite';
import { Readable } from 'node:stream';
import { currentUser } from './auth-api';

/** Local development endpoint. The key is kept in memory and sent only to OpenAI. */
export function creativeApi(): Plugin {
  return { name: 'creative-local-api', configureServer(server) {
    server.middlewares.use('/api/criativos/gerar', async (req, res) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      const fail = (status: number, error: string) => { res.statusCode = status; res.end(JSON.stringify({ error })); };
      if (req.method !== 'POST') return fail(405, 'Método não permitido.');
      const user = currentUser(req);
      if (!user || user.status !== 'approved') return fail(401, 'Entre com uma conta autorizada para gerar criativos.');
      try {
        const incoming = new Request('http://localhost/api', { method: 'POST', headers: req.headers as HeadersInit, body: Readable.toWeb(req) as ReadableStream, duplex: 'half' } as RequestInit);
        const input = await incoming.formData();
        const key = String(input.get('apiKey') || process.env.OPENAI_API_KEY || '').trim();
        if (!key) return fail(400, 'Informe a chave da API OpenAI para gerar a arte.');
        const prompt = String(input.get('prompt') || '').trim();
        const photos = input.getAll('photos').filter((v): v is File => v instanceof File && v.size > 0);
        const logo = input.get('logo');
        const images = [...photos, ...(logo instanceof File && logo.size > 0 ? [logo] : [])];
        if (!prompt || photos.length < 1 || photos.length > 2) return fail(400, 'Informe a descrição e uma ou duas fotos.');
        if (images.some(f => !['image/png', 'image/jpeg', 'image/webp'].includes(f.type) || f.size > 10 * 1024 * 1024)) return fail(400, 'Use imagens PNG, JPG ou WebP de até 10 MB cada.');
        const data = new FormData();
        data.append('model', 'gpt-image-1.5');
        data.append('prompt', `${prompt}\nA primeira${photos.length > 1 ? ' e a segunda imagens são fotos do imóvel' : ' imagem é a foto do imóvel'}.${images.length > photos.length ? ' A última imagem enviada é a logo.' : ''}`);
        data.append('size', input.get('square') === 'true' ? '1024x1024' : '1024x1536');
        data.append('quality', 'medium');
        data.append('input_fidelity', 'high');
        images.forEach(f => data.append('image[]', f, f.name));
        const response = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: data });
        const result = await response.json() as { data?: { b64_json?: string }[]; error?: { message?: string } };
        if (!response.ok || !result.data?.[0]?.b64_json) return fail(response.ok ? 502 : response.status, result.error?.message || 'A OpenAI não retornou uma imagem.');
        res.end(JSON.stringify({ image: result.data[0].b64_json }));
      } catch { fail(500, 'Não foi possível concluir a solicitação. Confira a conexão e tente novamente.'); }
    });
  } };
}
