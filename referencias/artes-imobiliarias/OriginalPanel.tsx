import React, { useEffect, useState } from 'react';
import { renderOriginal } from './original-engine.mjs';

type Props = { folder?: string; clientName?: string; clientFont?: string; clientFontName?: string; photo: File | null; secondPhoto: boolean; logo: File | string | null; details: string; apiKey: string; format: number; onResult: (image: string, warnings: string[], title: string, professional: string, referenceFile: string, referenceLabel: string) => void; onInvalidate: () => void; onSaveVariant: (image:string, warnings:string[], title:string, professional:string, referenceFile:string, referenceLabel:string, formatIndex:number) => void; reuse?: { title?: string; professional?: string; referenceFile?: string; key: string } | null };
const dimensions = [[1080,1080],[1080,1350],[1080,1920]];

export default function OriginalPanel({ folder, clientName, clientFont, clientFontName, photo, secondPhoto, logo, details, apiKey, format, onResult, onInvalidate, onSaveVariant, reuse }: Props) {
  const [files, setFiles] = useState<string[]>([]); const [selected, setSelected] = useState('');
  const [analysis, setAnalysis] = useState<any>(null); const [title, setTitle] = useState('');
  const [layer, setLayer] = useState('title'); const [fontFamily, setFontFamily] = useState(''); const [fontFile, setFontFile] = useState('');
  const [variants, setVariants] = useState<{name:string;image:string;warnings:string[];formatIndex:number}[]>([]);
  const [professional, setProfessional] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true; setFiles([]); setSelected(''); setAnalysis(null); setMessage('');
    if (folder) fetch(`/api/original?folder=${encodeURIComponent(folder)}`).then(async r => { const data=await r.json(); if (!r.ok) throw new Error(data.error); if (active) setFiles(data.files); }).catch(e=>{ if(active) setMessage(e.message || 'Não foi possível carregar as referências.'); });
    return () => { active=false; };
  }, [folder]);
  useEffect(() => { if (reuse) { setTitle(reuse.title || ''); setProfessional(reuse.professional || ''); if (reuse.referenceFile && files.includes(reuse.referenceFile)) setSelected(reuse.referenceFile); } }, [reuse, files]);
  useEffect(() => { let active=true; setFontFamily(''); setFontFile(''); if (clientFont) { const family=`MarcaOriginal${crypto.randomUUID().replace(/-/g,'')}`; const face=new FontFace(family, `url(${clientFont})`); face.load().then(loaded=>{if(active){document.fonts.add(loaded);setFontFamily(family);setFontFile(clientFontName || 'Fonte do cliente');}}).catch(()=>{if(active)setMessage('Não foi possível carregar a fonte do cliente.');}); } return ()=>{active=false}; }, [clientFont,clientFontName]);
  function updateLayer(key: string, value: number | string) { setAnalysis((old:any) => { if (!old) return old; const next=structuredClone(old); const item = layer === 'photo' || layer === 'logo' ? next[layer] : next[layer].box; if (['x','y','w','h'].includes(key)) item[key]=Number(value); else next[layer][key]=value; return next; }); setVariants([]); onInvalidate(); }
  async function loadFont(file: File | undefined) { if (!file) return; if (file.size > 5*1024*1024 || !/\.(woff2?|ttf|otf)$/i.test(file.name)) { setMessage('Use uma fonte WOFF, WOFF2, TTF ou OTF de até 5 MB.'); return; } try { const family=`MarcaOriginal${crypto.randomUUID().replace(/-/g,'')}`; const font=new FontFace(family, await file.arrayBuffer()); await font.load(); document.fonts.add(font); setFontFamily(family); setFontFile(file.name); setVariants([]); onInvalidate(); } catch { setMessage('Não foi possível carregar esta fonte.'); } }
  useEffect(() => { setVariants([]); }, [photo, logo, details, title, professional, folder]);
  async function analyze() {
    if (!folder || !selected || busy) return;
    setBusy(true); setMessage(''); setAnalysis(null); setVariants([]);
    try {
      const response = await fetch('/api/original', { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ folder, file: selected, apiKey }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Não foi possível analisar a referência.');
      setAnalysis(data.analysis); setMessage(data.cached ? 'Análise individual recuperada, sem nova cobrança.' : 'Referência analisada. Confira as observações antes de montar.');
    } catch(e) { setMessage(e instanceof Error ? e.message : 'Não foi possível analisar a referência.'); }
    finally { setBusy(false); }
  }
  async function create() {
    if (!analysis || !photo || busy) { setMessage('Analise a referência e adicione uma foto do imóvel.'); return; }
    if (secondPhoto) { setMessage('O modo Original monta uma foto por vez. Remova a segunda foto para continuar.'); return; }
    setBusy(true); setMessage('');
    try {
      const [width,height]=dimensions[format];
      const result=await renderOriginal({plan:analysis,photo,logo,title,details,professional,width,height,fontFamily});
      onResult(result.image,result.warnings,title.trim(),professional.trim(),selected,`Referência ${files.indexOf(selected)+1}`); setMessage('Arte montada. Confira o resultado e os avisos antes de baixar.');
    } catch(e) { setMessage(e instanceof Error ? e.message : 'Não foi possível montar a arte.'); }
    finally { setBusy(false); }
  }
  async function createVariants() {
    if (!analysis || !photo || secondPhoto || busy) { setMessage('Analise uma referência e selecione uma foto para criar os formatos.'); return; }
    setBusy(true); setMessage(''); const results: {name:string;image:string;warnings:string[];formatIndex:number}[] = []; const failures:string[]=[];
    for (const [i, name] of ['Feed quadrado','Feed vertical','Story / Reels'].entries()) { try { const [width,height]=dimensions[i]; const result=await renderOriginal({plan:analysis,photo,logo,title,details,professional,width,height,fontFamily}); results.push({name,formatIndex:i,...result}); } catch(e) { failures.push(`${name}: ${e instanceof Error ? e.message : 'não foi possível montar'}`); } }
    setVariants(results); setMessage(failures.length ? failures.join(' • ') : 'Formatos criados. Revise cada um antes de baixar.'); setBusy(false);
  }
  const layerBox=analysis && (layer === 'photo' || layer === 'logo' ? analysis[layer] : analysis[layer]?.box);
  return <section className="card original-panel">
    <div className="section-top"><div className="number">05</div><div><h2>Composição original</h2><p>Escolha uma peça de {clientName || 'um cliente'} para orientar esta arte.</p></div></div>
    {!folder ? <p>Selecione um cliente com referências vinculadas. Cadastros antigos sem vínculo precisam ser salvos novamente.</p> : <>
      <div className="original-references" role="group" aria-label="Escolher referência">{files.map((file,i)=><button type="button" key={file} disabled={busy} aria-pressed={selected===file} className={selected===file?'selected':''} onClick={()=>{setSelected(file);setAnalysis(null);setMessage('');onInvalidate();}}><img src={`/api/original?folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(file)}`} alt={`Referência ${i+1} de ${clientName || 'cliente'}`}/><span>Referência {i+1}</span></button>)}</div>
      {!files.length && <p className="mini-note">Nenhuma referência disponível para este cliente.</p>}
      {selected && <p className="original-selection" role="status">✓ Referência {files.indexOf(selected)+1} selecionada como base. Você pode trocar antes de analisar.</p>}
      <button type="button" className="reference-save" onClick={analyze} disabled={!selected || busy}>{busy ? 'Aguarde…' : 'Analisar referência selecionada'}</button>
      <p className="mini-note">A análise usa a API e pode gerar custo. Análises feitas antes desta atualização precisam ser refeitas; depois, o resultado é reutilizado.</p>
      {analysis && <div className="original-analysis"><strong>O que foi identificado</strong><p><b>Finalidade:</b> {analysis.purpose}</p><p><b>Orientação e formato:</b> {analysis.orientation}</p><p><b>Composição:</b> {analysis.summary}</p><p><b>Identidade observada nesta peça:</b> {analysis.recurringIdentity}</p><p><b>Tratamento da imagem:</b> {analysis.imageTreatment}</p><p><b>Tipografia aproximada:</b> {analysis.typography}</p><p><b>Cores aproximadas:</b> {analysis.palette}</p><p><b>Elementos:</b> {analysis.graphics}</p><p><b>Elementos mapeados para montagem:</b> {analysis.graphicLayers?.length ?? 0}</p><p><b>Escolhas desta peça:</b> {analysis.specificChoices}</p><p><b>Dúvidas:</b> {analysis.uncertainties}</p></div>}
      <label className="field-label spacer" htmlFor="original-title">TÍTULO EXATO</label><input id="original-title" value={title} onChange={e=>{setTitle(e.target.value);onInvalidate();}} placeholder="Ex.: Apartamento no Bessa"/>
      <p className="mini-note">O campo “Descrição e localização” será reproduzido como texto secundário, sem reescrita.</p>
      <label className="field-label spacer" htmlFor="original-professional">IDENTIFICAÇÃO PROFISSIONAL · SE NECESSÁRIA</label><input id="original-professional" value={professional} onChange={e=>{setProfessional(e.target.value);onInvalidate();}} placeholder="Ex.: CRECI informado pelo responsável"/>
      <p className="mini-note">Informe a identificação quando ela for necessária. O sistema não irá inventá-la.</p>
      {analysis && <div className="original-analysis"><strong>Ajustar composição</strong><p className="mini-note">Ajuste as áreas e monte novamente para atualizar a prévia. A foto e a logo mantêm suas proporções.</p>
        <label className="field-label" htmlFor="original-layer">ELEMENTO</label><select id="original-layer" value={layer} onChange={e=>setLayer(e.target.value)}><option value="photo">Foto</option><option value="title">Título</option><option value="details">Informações</option><option value="professional">Identificação</option><option value="logo">Logo</option></select>
        {layerBox && <div className="original-editor-grid">{([['x','Posição horizontal'],['y','Posição vertical'],['w','Largura'],['h','Altura']] as const).map(([key,label])=><label key={key}>{label} (%)<input type="number" min={key==='w'||key==='h'?4:0} max="100" value={Math.round(layerBox[key]*100)} onChange={e=>updateLayer(key,Number(e.target.value)/100)}/></label>)}</div>}
        {!['photo','logo'].includes(layer) && <><label className="field-label spacer">COR DO TEXTO</label><input type="color" value={analysis[layer].color} onChange={e=>updateLayer('color',e.target.value)}/><label className="field-label spacer">TAMANHO DO TEXTO</label><input type="range" min="2" max="14" value={Math.round(analysis[layer].relativeSize*100)} onChange={e=>updateLayer('relativeSize',Number(e.target.value)/100)}/></>}
        <label className="field-label spacer" htmlFor="original-font">FONTE DA MARCA · OPCIONAL</label><input id="original-font" type="file" accept=".woff,.woff2,.ttf,.otf" onChange={e=>void loadFont(e.target.files?.[0])}/><p className="mini-note">{fontFile ? `Fonte carregada: ${fontFile}. Disponível nesta sessão.` : 'Carregue uma fonte autorizada para aplicar aos textos nesta sessão.'}</p>
      </div>}
      <button type="button" className="primary" disabled={!analysis || busy} onClick={create}>{busy ? 'Aguarde…' : 'Montar arte original'}</button>
      <button type="button" className="reference-save" disabled={!analysis || busy} onClick={createVariants}>Criar versões para feed e stories</button>
      {!!variants.length && <div className="original-variants">{variants.map(v=><article key={v.name}><strong>{v.name}</strong><img src={v.image} alt={`Prévia ${v.name}`}/><a href={v.image} download={`criativo-${v.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`}>Baixar {v.name}</a><button type="button" className="reference-save" onClick={()=>onSaveVariant(v.image,v.warnings,title.trim(),professional.trim(),selected,`Referência ${files.indexOf(selected)+1}`,v.formatIndex)}>Salvar no histórico</button><details><summary>Ver avisos ({v.warnings.length})</summary>{v.warnings.map((w,i)=><p key={i}>{w}</p>)}</details></article>)}</div>}
    </>}
    {message && <p className="original-message" role="status">{message}</p>}
  </section>;
}
