import { test } from 'node:test';
import assert from 'node:assert/strict';
import { containRect, normalizeBox, wrapText, validateAnalysis, boxesOverlap, contrastRatio, validateGraphicLayers, graphicOverlapsBox } from './original-engine.mjs';
test('a imagem e a logo cabem sem corte ou distorção', () => { const r=containRect(400,200,{x:0,y:0,w:100,h:100}); assert.deepEqual(r,{x:0,y:25,w:100,h:50}); assert.equal(r.w/r.h,2); });
test('caixas são limitadas à área da arte e posições inválidas são rejeitadas', () => { assert.deepEqual(normalizeBox({x:.8,y:.2,w:.5,h:.3}),{x:.8,y:.2,w:1-.8,h:.3}); assert.throws(()=>normalizeBox({x:1,y:0,w:0,h:1})); });
test('texto é quebrado sem perder palavras e palavras que não cabem são rejeitadas', () => { assert.deepEqual(wrapText('3 quartos\n2 banheiros',x=>x.length,12),['3 quartos','2 banheiros']); assert.equal(wrapText('muitolongo',x=>x.length,4),null); });
test('análises incompletas não são renderizadas', () => { assert.throws(()=>validateAnalysis({backgroundColor:'#ffffff'})); });

test('identifica colisões entre elementos sem acusar áreas separadas', () => { assert.equal(boxesOverlap({x:0,y:0,w:.5,h:.3},{x:.2,y:.1,w:.5,h:.3}),true); assert.equal(boxesOverlap({x:0,y:0,w:.5,h:.3},{x:0,y:.4,w:.5,h:.3}),false); });

test('identifica contraste fraco e forte', () => { assert.ok(contrastRatio([255,255,255],[255,255,255]) < 4.5); assert.ok(contrastRatio([255,255,255],[0,0,0]) > 4.5); });

test('preserva espaços internos ao renderizar texto fornecido', () => { assert.deepEqual(wrapText('3  quartos', x=>x.length, 20), ['3  quartos']); });

test('preserva faixas e molduras analisadas sem adicionar elementos', () => {
  const layers=[{kind:'fill',box:{x:.1,y:.1,w:.6,h:.04},color:'#ad7300',opacity:1,cornerRadius:0,strokeWidth:0,purpose:'faixa observada'}];
  assert.deepEqual(validateGraphicLayers(layers),layers); assert.deepEqual(validateGraphicLayers([]),[]);
});
test('rejeita efeitos não suportados e elementos gráficos fora da arte', () => {
  const base={kind:'fill',box:{x:.1,y:.1,w:.6,h:.04},color:'#ad7300',opacity:1,cornerRadius:0,strokeWidth:0,purpose:'faixa'};
  assert.throws(()=>validateGraphicLayers([{...base,kind:'glow'}]));
  assert.throws(()=>validateGraphicLayers([{...base,box:{x:.9,y:.1,w:.6,h:.1}}]));
});

test('detecta moldura cruzando a logo sem confundir fundo preenchido', () => {
  const frame={kind:'outline',box:{x:.1,y:.1,w:.8,h:.8},strokeWidth:.002};
  assert.equal(graphicOverlapsBox(frame,{x:.4,y:.87,w:.2,h:.08}),true);
  assert.equal(graphicOverlapsBox(frame,{x:.4,y:.5,w:.2,h:.08}),false);
  assert.equal(graphicOverlapsBox({...frame,kind:'fill'},{x:.4,y:.5,w:.2,h:.08}),false);
});
