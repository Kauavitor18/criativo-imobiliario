// Geometry and validation shared by the Original renderer and its regression tests.
export function normalizeBox(box) {
  if (!box || !['x','y','w','h'].every(k => Number.isFinite(box[k]))) throw new Error('A análise não definiu uma posição válida.');
  const x = Math.max(0, Math.min(1, box.x)); const y = Math.max(0, Math.min(1, box.y));
  const w = Math.min(Math.max(0, box.w), 1-x); const h = Math.min(Math.max(0, box.h), 1-y);
  if (w < .04 || h < .025) throw new Error('A referência tem uma área pequena demais; selecione outra referência.');
  return { x, y, w, h };
}
export function containRect(sourceW, sourceH, box) {
  if (!(sourceW > 0 && sourceH > 0 && box.w > 0 && box.h > 0)) throw new Error('Imagem inválida.');
  const scale = Math.min(box.w / sourceW, box.h / sourceH);
  const w = sourceW * scale, h = sourceH * scale;
  return { x: box.x + (box.w-w)/2, y: box.y + (box.h-h)/2, w, h };
}
export function boxesOverlap(a, b) {
  const x = Math.max(0, Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x));
  const y = Math.max(0, Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  return x*y > 0.001;
}
export function wrapText(text, measure, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    if (!paragraph.trim()) { lines.push(''); continue; }
    let current = '';
    for (const token of paragraph.match(/\S+|\s+/g) || []) {
      if (!token.trim()) { current += token; continue; }
      if (measure(token) > maxWidth) return null;
      const candidate = current + token;
      if (measure(candidate) > maxWidth && current.trim()) { lines.push(current.trimEnd()); current = token; }
      else current = candidate;
    }
    lines.push(current.trimEnd());
  }
  return lines;
}
export function contrastRatio(a, b) {
  const lum = rgb => { const v=rgb.map(x=>{ const c=x/255; return c<=0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4; }); return .2126*v[0]+.7152*v[1]+.0722*v[2]; };
  const l1=lum(a),l2=lum(b); return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
}
const colorRgb = c => [1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const isColor = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
export function validateGraphicLayers(layers) {
  if (!Array.isArray(layers) || layers.length > 12) throw new Error('A análise retornou elementos gráficos inválidos.');
  return layers.map(layer => {
    if (!layer || !['fill','outline','line'].includes(layer.kind) || !isColor(layer.color) || !Number.isFinite(layer.opacity) || layer.opacity < 0 || layer.opacity > 1 || !Number.isFinite(layer.cornerRadius) || layer.cornerRadius < 0 || layer.cornerRadius > .5 || !Number.isFinite(layer.strokeWidth) || layer.strokeWidth < 0 || layer.strokeWidth > .03) throw new Error('A análise retornou um elemento gráfico inválido.');
    const box = layer.box;
    if (!box || !['x','y','w','h'].every(k=>Number.isFinite(box[k])) || box.x < 0 || box.y < 0 || box.w <= 0 || box.h <= 0 || box.x + box.w > 1.001 || box.y + box.h > 1.001) throw new Error('A análise retornou um elemento gráfico fora da arte.');
    return layer;
  });
}
export function graphicOverlapsBox(layer, target) {
  if (layer.kind === 'fill') return false; // Fundos podem ficar intencionalmente atrás de texto ou logo.
  const b=layer.box, thick=Math.max(.001,layer.strokeWidth || 0);
  const pieces=layer.kind === 'line'
    ? [b.w >= b.h ? {x:b.x,y:b.y+b.h/2-thick/2,w:b.w,h:thick} : {x:b.x+b.w/2-thick/2,y:b.y,w:thick,h:b.h}]
    : [{x:b.x,y:b.y,w:b.w,h:thick},{x:b.x,y:b.y+b.h-thick,w:b.w,h:thick},{x:b.x,y:b.y,w:thick,h:b.h},{x:b.x+b.w-thick,y:b.y,w:thick,h:b.h}];
  return pieces.some(a=>Math.min(a.x+a.w,target.x+target.w)>Math.max(a.x,target.x) && Math.min(a.y+a.h,target.y+target.h)>Math.max(a.y,target.y));
}
function paintGraphic(ctx, layer, width, height) {
  const b=layer.box, x=b.x*width, y=b.y*height, w=b.w*width, h=b.h*height;
  const stroke=Math.max(1,layer.strokeWidth*Math.min(width,height));
  ctx.save(); ctx.globalAlpha=layer.opacity; ctx.fillStyle=layer.color; ctx.strokeStyle=layer.color; ctx.lineWidth=stroke;
  ctx.beginPath();
  if (layer.kind === 'line') {
    if(w>=h){ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);}else{ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);}
    ctx.stroke();
  } else {
    const radius=Math.min(w,h)*layer.cornerRadius;
    ctx.moveTo(x+radius,y);ctx.lineTo(x+w-radius,y);ctx.quadraticCurveTo(x+w,y,x+w,y+radius);ctx.lineTo(x+w,y+h-radius);ctx.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);ctx.lineTo(x+radius,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-radius);ctx.lineTo(x,y+radius);ctx.quadraticCurveTo(x,y,x+radius,y);ctx.closePath();
    if(layer.kind==='fill') ctx.fill(); else ctx.stroke();
  }
  ctx.restore();
}
export function validateAnalysis(plan) {
  if (!plan || !isColor(plan.backgroundColor)) throw new Error('A análise não retornou cores válidas; tente analisar novamente.');
  for (const key of ['title','details','professional']) {
    const item = plan[key]; normalizeBox(item?.box);
    if (!isColor(item.color) || !isColor(item.background) || !['serif','sans-serif'].includes(item.font) || !['left','center','right'].includes(item.align) || !['none','fill','outline'].includes(item.decoration) || !Number.isFinite(item.relativeSize)) throw new Error('A análise retornou uma composição incompleta; tente outra referência.');
  }
  normalizeBox(plan.photo); normalizeBox(plan.logo);
  if (plan.graphicLayers !== undefined) validateGraphicLayers(plan.graphicLayers);
  return plan;
}
export async function loadImage(source) {
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  try { return await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error('Não foi possível abrir uma das imagens.')); image.src = url; }); }
  finally { if (typeof source !== 'string') URL.revokeObjectURL(url); }
}
export async function renderOriginal({ plan, photo, logo, title, details, professional, width, height }) {
  validateAnalysis(plan);
  if (!title.trim()) throw new Error('Informe o título exato que deve aparecer na arte.');
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Não foi possível montar a imagem neste navegador.');
  ctx.fillStyle = plan.backgroundColor; ctx.fillRect(0,0,width,height);
  const image = await loadImage(photo);
  const photoBox = normalizeBox(plan.photo);
  const fit = containRect(image.naturalWidth, image.naturalHeight, { x:photoBox.x*width,y:photoBox.y*height,w:photoBox.w*width,h:photoBox.h*height });
  ctx.drawImage(image,fit.x,fit.y,fit.w,fit.h);
  for (const layer of (plan.graphicLayers || [])) paintGraphic(ctx, layer, width, height);
  const warnings = [];
  const blocks = [{ name:'título', box:normalizeBox(plan.title.box) }, ...(details.trim() ? [{ name:'informações', box:normalizeBox(plan.details.box) }] : []), ...(professional.trim() ? [{ name:'identificação profissional', box:normalizeBox(plan.professional.box) }] : []), ...(logo ? [{ name:'logo', box:normalizeBox(plan.logo) }] : [])];
  for (let i=0; i<blocks.length; i++) for (let j=i+1; j<blocks.length; j++) if (boxesOverlap(blocks[i].box,blocks[j].box)) throw new Error(`As áreas de ${blocks[i].name} e ${blocks[j].name} se sobrepõem na análise. Escolha outra referência.`);
  for (const block of blocks) if ((plan.graphicLayers || []).some(layer => graphicOverlapsBox(layer,block.box))) warnings.push(`Uma linha ou moldura pode cruzar ${block.name}; revise a composição antes de usar.`);
  warnings.push('A tipografia e as posições são aproximações da referência; fontes oficiais, gradientes e efeitos complexos não são reproduzidos automaticamente.');
  if (fit.w < width - 1 || fit.h < height - 1) warnings.push('A foto inteira foi preservada; a área restante foi preenchida pela cor de fundo estimada da referência.');
  const renderText = (text, block, label) => {
    if (!text.trim()) return;
    const b = normalizeBox(block.box); const x=b.x*width,y=b.y*height,w=b.w*width,h=b.h*height;
    const min = Math.max(24, Math.round(height*.018)); let size = Math.min(height*.14, Math.max(min, block.relativeSize*height)); let lines = null;
    const padding = Math.min(w*.04, height*.015);
    const lineHeight = Number.isFinite(block.lineHeight) ? Math.max(.9, Math.min(2, block.lineHeight)) : 1.18;
    while (size >= min) {
      ctx.font = `${block.italic ? 'italic ' : ''}${block.bold ? '700' : '400'} ${size}px ${block.font}`;
      lines = wrapText(text, value => ctx.measureText(value).width, w-padding*2);
      if (lines && lines.length * size * lineHeight <= h-padding*2) break;
      lines = null; size -= 2;
    }
    if (!lines) throw new Error(`${label} não cabe de forma legível na área da referência. Reduza o texto ou escolha outra referência.`);
    if (size < block.relativeSize*height*.75) warnings.push(`${label}: o texto precisou ser reduzido para caber na área.`);
    const textColor = colorRgb(block.color);
    let contrastRisk = false;
    if (block.decoration === 'fill') contrastRisk = contrastRatio(textColor, colorRgb(block.background)) < 4.5;
    else {
      const pixels = ctx.getImageData(Math.floor(x), Math.floor(y), Math.max(1,Math.floor(w)), Math.max(1,Math.floor(h)));
      let low=0, total=0;
      for (let sy=1; sy<=3; sy++) for (let sx=1; sx<=3; sx++) { const px=Math.min(pixels.width-1,Math.floor(pixels.width*sx/4)), py=Math.min(pixels.height-1,Math.floor(pixels.height*sy/4)); const idx=(py*pixels.width+px)*4; if (contrastRatio(textColor,[pixels.data[idx],pixels.data[idx+1],pixels.data[idx+2]]) < 4.5) low++; total++; }
      contrastRisk = low >= Math.ceil(total/3);
    }
    if (contrastRisk) warnings.push(`${label}: possível contraste insuficiente com o fundo; confira a leitura e escolha outra referência se necessário.`);
    if (block.decoration === 'fill') { ctx.fillStyle = block.background; ctx.fillRect(x,y,w,h); }
    if (block.decoration === 'outline') { ctx.strokeStyle = block.background; ctx.lineWidth = Math.max(1,width*.0015); ctx.strokeRect(x,y,w,h); }
    ctx.fillStyle=block.color; ctx.textAlign=block.align; ctx.textBaseline='top';
    const textX=block.align==='center'?x+w/2:block.align==='right'?x+w-padding:x+padding;
    const textHeight = lines.length*size*lineHeight;
    const textY=block.verticalAlign === 'top' ? y+padding : block.verticalAlign === 'bottom' ? y+h-padding-textHeight : y+(h-textHeight)/2;
    lines.forEach((line,i)=>ctx.fillText(line,textX,textY+i*size*lineHeight));
  };
  renderText(title,plan.title,'O título'); renderText(details,plan.details,'As informações'); renderText(professional,plan.professional,'A identificação profissional');
  if (logo) { const mark=await loadImage(logo); const b=normalizeBox(plan.logo); const r=containRect(mark.naturalWidth,mark.naturalHeight,{x:b.x*width,y:b.y*height,w:b.w*width,h:b.h*height}); ctx.drawImage(mark,r.x,r.y,r.w,r.h); }
  else warnings.push('Nenhuma logo foi fornecida.');
  warnings.push('Confira visualmente o contraste, a sobreposição sobre o imóvel e a proximidade com a referência; estes itens não são avaliados automaticamente.');
  return { image: canvas.toDataURL('image/png'), warnings };
}
