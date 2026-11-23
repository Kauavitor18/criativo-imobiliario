import React, { useEffect, useState } from 'react';
import { renderOriginal } from './original-engine.mjs';

type Props = { folder?: string; clientName?: string; photo: File | null; secondPhoto: boolean; logo: File | string | null; details: string; apiKey: string; format: number; onResult: (image: string, warnings: string[], title: string) => void; onInvalidate: () => void };
const dimensions = [[1080,1080],[1080,1350],[1080,1920]];

export default function OriginalPanel({ folder, clientName, photo, secondPhoto, logo, details, apiKey, format, onResult, onInvalidate }: Props) {
  const [files, setFiles] = useState<string[]>([]); const [selected, setSelected] = useState('');
  const [analysis, setAnalysis] = useState<any>(null); const [title, setTitle] = useState('');
  const [professional, setProfessional] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true; setFiles([]); setSelected(''); setAnalysis(null); setMessage('');
    if (folder) fetch(`/api/original?folder=${encodeURIComponent(folder)}`).then(async r => { const data=await r.json(); if (!r.ok) throw new Error(data.error); if (active) setFiles(data.files); }).catch(e=>{ if(active) setMessage(e.message || 'Não foi possível carregar as referências.'); });
    return () => { active=false; };
  }, [folder]);
  async function analyze() {
    if (!folder || !selected || busy) return;
    setBusy(true); setMessage(''); setAnalysis(null);
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
      const result=await renderOriginal({plan:analysis,photo,logo,title,details,professional,width,height});
      onResult(result.image,result.warnings,title.trim()); setMessage('Arte montada. Confira o resultado e os avisos antes de baixar.');
    } catch(e) { setMessage(e instanceof Error ? e.message : 'Não foi possível montar a arte.'); }
    finally { setBusy(false); }
  }
  return <section className="card original-panel">
    <div className="section-top"><div className="number">05</div><div><h2>Composição original</h2><p>Escolha uma peça de {clientName || 'um cliente'} para orientar esta arte.</p></div></div>
    {!folder ? <p>Selecione um cliente com referências vinculadas. Cadastros antigos sem vínculo precisam ser salvos novamente.</p> : <>
      <div className="original-references" role="group" aria-label="Escolher referência">{files.map((file,i)=><button type="button" key={file} aria-pressed={selected===file} className={selected===file?'selected':''} onClick={()=>{setSelected(file);setAnalysis(null);setMessage('');onInvalidate();}}><img src={`/api/original?folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(file)}`} alt={`Referência ${i+1} de ${clientName || 'cliente'}`}/><span>Referência {i+1}</span></button>)}</div>
      {!files.length && <p className="mini-note">Nenhuma referência disponível para este cliente.</p>}
      <button type="button" className="reference-save" onClick={analyze} disabled={!selected || busy}>{busy ? 'Aguarde…' : 'Analisar referência selecionada'}</button>
      <p className="mini-note">A análise usa a API e pode gerar custo. Análises feitas antes desta atualização precisam ser refeitas; depois, o resultado é reutilizado.</p>
      {analysis && <div className="original-analysis"><strong>O que foi identificado</strong><p><b>Finalidade:</b> {analysis.purpose}</p><p><b>Orientação e formato:</b> {analysis.orientation}</p><p><b>Composição:</b> {analysis.summary}</p><p><b>Identidade observada nesta peça:</b> {analysis.recurringIdentity}</p><p><b>Tratamento da imagem:</b> {analysis.imageTreatment}</p><p><b>Tipografia aproximada:</b> {analysis.typography}</p><p><b>Cores aproximadas:</b> {analysis.palette}</p><p><b>Elementos:</b> {analysis.graphics}</p><p><b>Elementos mapeados para montagem:</b> {analysis.graphicLayers?.length ?? 0}</p><p><b>Escolhas desta peça:</b> {analysis.specificChoices}</p><p><b>Dúvidas:</b> {analysis.uncertainties}</p></div>}
      <label className="field-label spacer" htmlFor="original-title">TÍTULO EXATO</label><input id="original-title" value={title} onChange={e=>{setTitle(e.target.value);onInvalidate();}} placeholder="Ex.: Apartamento no Bessa"/>
      <p className="mini-note">O campo “Descrição e localização” será reproduzido como texto secundário, sem reescrita.</p>
      <label className="field-label spacer" htmlFor="original-professional">IDENTIFICAÇÃO PROFISSIONAL · SE NECESSÁRIA</label><input id="original-professional" value={professional} onChange={e=>{setProfessional(e.target.value);onInvalidate();}} placeholder="Ex.: CRECI informado pelo responsável"/>
      <p className="mini-note">Informe a identificação quando ela for necessária. O sistema não irá inventá-la.</p>
      <button type="button" className="primary" disabled={!analysis || busy} onClick={create}>{busy ? 'Aguarde…' : 'Montar arte original'}</button>
    </>}
    {message && <p className="original-message" role="status">{message}</p>}
  </section>;
}
