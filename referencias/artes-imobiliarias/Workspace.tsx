import React, { useEffect, useState } from 'react';
import { Building2, Sparkles, ImagePlus, UsersRound, Clock3, Settings2, ArrowUpRight, X, Copy, Plus, Check } from 'lucide-react';
import './workspace.css';
import OriginalPanel from './OriginalPanel';
import type { OriginalDraft } from './OriginalPanel';
import ClientDetail from './ClientDetail';
import HistoryList from './HistoryList';
import type { Analysis, Profile, Entry } from './client-types';
import { applyBrandLogo } from './brand-logo.mjs';
import promptReference from '../../PROMPTS-E-ESTILOS.md?raw';

const SEGMENTS = ['Original', 'Litoral', 'Alto padrão', 'Popular', 'Terreno', 'Lançamento', 'Rural'];
const SIZES = [{ name: 'Feed quadrado', size: '1080 × 1080', ratio: '1:1' }, { name: 'Feed vertical', size: '1080 × 1350', ratio: '4:5' }, { name: 'Story / Reels', size: '1080 × 1920', ratio: '9:16' }];
function load<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; } }

export default function Workspace({ userId, userName, isAdmin, onLogout, onAdmin }: { userId: number; userName: string; isAdmin: boolean; onLogout: () => void; onAdmin: () => void }) {
  const [tab, setTab] = useState<'criar' | 'perfis' | 'historico' | 'configuracoes'>('criar');
  const [profiles, setProfiles] = useState<Profile[]>(() => load(`criativo-perfis-${userId}`, []));
  const [history, setHistory] = useState<Entry[]>(() => load(`criativo-rascunhos-${userId}`, []));
  const [savedHistory, setSavedHistory] = useState<Entry[]>([]);
  const [historyError, setHistoryError] = useState('');
  const [pendingSave, setPendingSave] = useState<{image:string; data:Partial<Entry> & {draft?:OriginalDraft}} | null>(null);
  const [profileId, setProfileId] = useState('');
  const [reuse, setReuse] = useState<{title?:string;professional?:string;referenceFile?:string;draft?:OriginalDraft;key:string}|null>(null);
  const [clientDetailId, setClientDetailId] = useState('');
  const [segment, setSegment] = useState('');
  const [format, setFormat] = useState(1);
  const [description, setDescription] = useState('');
  const [sky, setSky] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoVersion, setLogoVersion] = useState('');
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [originalWarnings, setOriginalWarnings] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [newName, setNewName] = useState('');
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [references, setReferences] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => { localStorage.setItem(`criativo-perfis-${userId}`, JSON.stringify(profiles)); }, [profiles, userId]);
  useEffect(() => { localStorage.setItem(`criativo-rascunhos-${userId}`, JSON.stringify(history)); }, [history, userId]);
  useEffect(() => { const next = photos.map(file => URL.createObjectURL(file)); setUrls(next); return () => next.forEach(URL.revokeObjectURL); }, [photos]);
  useEffect(() => { let active=true; fetch('/api/historico').then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.error);if(active){setSavedHistory(data.entries);setHistoryError('');}}).catch(()=>{if(active)setHistoryError('Não foi possível carregar as artes salvas. Atualize a página para tentar novamente.');});return ()=>{active=false;}; }, [userId]);
  async function saveArtwork(image:string, data:Partial<Entry> & {draft?:OriginalDraft}) {
    setPendingSave({image,data});
    try { const response=await fetch('/api/historico',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,image})}); const body=await response.json(); if(!response.ok)throw new Error(body.error);setSavedHistory(old=>[body.entry,...old]);setPendingSave(null);setNotice('Arte salva no histórico. Confira os detalhes antes de usar.'); }
    catch {setNotice('A arte foi gerada, mas não foi salva no histórico. Baixe a imagem ou tente salvar novamente.');}
  }
  async function deleteHistory(entry:Entry) {
    if(!window.confirm('Excluir este registro do histórico? Esta ação não pode ser desfeita.'))return;
    if(!entry.savedImage){setHistory(old=>old.filter(item=>item.id!==entry.id));return;}
    try {const response=await fetch(`/api/historico/${entry.id}`,{method:'DELETE'});if(!response.ok)throw new Error();setSavedHistory(old=>old.filter(item=>item.id!==entry.id));}catch{setNotice('Não foi possível excluir a arte. Tente novamente.');}
  }
  async function reuseArtwork(entry:Entry) {
    let draft:OriginalDraft | undefined;
    if (entry.savedImage && entry.segment === 'Original') {
      try { const response=await fetch(`/api/historico/${entry.id}/rascunho`); if(!response.ok)throw new Error(); const body=await response.json(); draft=body.draft || undefined; }
      catch { setNotice('Não foi possível carregar os dados de edição desta arte. Tente novamente.'); return; }
    }
    const profile = profiles.find(p => p.id === entry.profileId);
    const formatIndex = SIZES.findIndex(s => s.size === entry.format);
    setProfileId(profile?.id || ''); setSegment(SEGMENTS.includes(entry.segment) ? entry.segment : ''); setFormat(formatIndex >= 0 ? formatIndex : 1);
    setDescription(entry.description || ''); setPhotos(draft ? [new File([await (await fetch(draft.photo)).blob()],'foto-original',{type:draft.photo.slice(5,draft.photo.indexOf(';'))})] : []); setLogo(draft?.logo ? new File([await (await fetch(draft.logo)).blob()],'logo-original',{type:draft.logo.slice(5,draft.logo.indexOf(';'))}) : null); setLogoVersion(''); setReuse({title:entry.title,professional:entry.professional,referenceFile:entry.referenceFile,draft,key:crypto.randomUUID()});
    setTab('criar'); setNotice(profile || !entry.profileId ? (draft ? 'Foto e composição recuperadas. Revise a arte antes de montar.' : 'Informações recuperadas. Selecione novamente a foto do imóvel e revise a referência.') : 'Cliente não encontrado. Selecione um cliente e a foto do imóvel para continuar.');
  }
  const allHistory = [...savedHistory, ...history];
  const selectedProfile = profiles.find(p => p.id === profileId);
  const detailProfile = profiles.find(p => p.id === clientDetailId);
  function saveClient(updated: Profile) { const next = profiles.map(p => p.id === updated.id ? updated : p); try { localStorage.setItem(`criativo-perfis-${userId}`, JSON.stringify(next)); } catch { throw new Error('Não há espaço no navegador para salvar. Tente uma logo menor.'); } setProfiles(next); }
  function removeClient() { if (!detailProfile || !window.confirm(`Excluir o cadastro de ${detailProfile.name}? As referências no computador não serão apagadas.`)) return; const next=profiles.filter(p=>p.id!==detailProfile.id); try { localStorage.setItem(`criativo-perfis-${userId}`, JSON.stringify(next)); } catch { setNotice('Não foi possível excluir o cadastro.'); return; } setProfiles(next); if(profileId===detailProfile.id){setProfileId('');setLogo(null);} setClientDetailId(''); setNotice('Cadastro excluído. Os arquivos de referência foram preservados no computador.'); }
  useEffect(() => { setGeneratedImage(''); setOriginalWarnings([]); }, [segment, profileId, description, photos, logo, logoVersion, format]);
  async function compose() {
    if (!description.trim() || !photos.length) { setNotice('Adicione pelo menos uma foto e a descrição do imóvel.'); return; }
    if (!apiKey.trim()) { setNotice('Configure a chave da API OpenAI em Configurações para gerar a arte.'); return; }
    if (segment === 'Original' && !selectedProfile?.referenceFolder) { setNotice('Para usar Original, selecione um cliente com imagens de referência salvas.'); return; }
    const selectedLogo = logo || selectedProfile?.logos?.find(item=>item.id===logoVersion)?.data || selectedProfile?.logoData || null;
    const hasLogo = !!selectedLogo;
    const base = promptReference.split('## Prompt base recebido')[1]?.split('## Blocos de estilo recebidos')[0]?.trim() || '';
    const key: Record<string, string> = { 'Litoral': 'Litoral', 'Alto padrão': 'Alto padrão', 'Popular': 'Popular', 'Terreno': 'Terreno', 'Lançamento': 'Lançamento', 'Rural': 'Rural', '': 'Geração livre' };
    const style = segment === 'Original' ? 'Priorize a identidade visual observada nas imagens de referência: cores, hierarquia, tipografia, composição, tratamento de imagem e elementos recorrentes. Crie uma peça nova para o imóvel fornecido; não copie fotos, textos ou marcas de terceiros das referências. Preserve fielmente o imóvel e use apenas os dados informados.' : promptReference.split(`### ${key[segment]} —`)[1]?.split('\n### ')[0]?.split('\n## ')[0]?.replace(/^[^\n]*\n/, '').trim() || '';
    const text = `${base}\n\n# ESTILO: ${segment || 'Geração livre'}\n${style}\n\n${selectedProfile ? `# PERFIL DE MARCA\nNome: ${selectedProfile.name}. ${selectedProfile.analysisStale ? 'Análise desatualizada; não usar as orientações anteriores.' : `Cores: ${selectedProfile.colors || 'não informadas'}. Orientações: ${selectedProfile.notes || 'não informadas'}.`}\n` : ''}\n${hasLogo ? '# MARCA\nNão desenhe nem recrie nenhuma logo, símbolo ou nome de marca. A logo original será aplicada separadamente após a geração; mantenha o canto superior direito livre de texto.' : '# SEM LOGO\nNão escreva a palavra logo, não crie marca ou placeholder e não reserve espaço para marca.'}\n${photos.length === 2 ? '\nMostre claramente as duas fotos do imóvel.\n' : ''}${sky ? '\n# EXPANSÃO DE CÉU\nExpanda apenas o céu, preservando a fidelidade do imóvel.\n' : ''}\n# FORMATO\n${SIZES[format].size}\n\n# DESCRIÇÃO DO USUÁRIO\n${description}\n\nNão invente dados do imóvel que não foram fornecidos.`;
    setPrompt(text); setNotice(''); setGenerating(true); setGeneratedImage('');
    try {
      const data = new FormData();
      data.append('apiKey', apiKey); data.append('prompt', text); data.append('square', String(format === 0));
      if (segment === 'Original' && selectedProfile?.referenceFolder) data.append('referenceFolder', selectedProfile.referenceFolder);
      photos.forEach(photo => data.append('photos', photo));
      const response = await fetch('/api/criativos/gerar', { method: 'POST', body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Não foi possível gerar a arte.');
      const generated = `data:image/png;base64,${body.image}`;
      const finalImage = selectedLogo ? await applyBrandLogo(generated, selectedLogo) : generated;
      setGeneratedImage(finalImage);
      await saveArtwork(finalImage,{description,segment:segment || 'Livre',format:SIZES[format].size,profileId:selectedProfile?.id,profileName:selectedProfile?.name});
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível gerar a arte.'); }
    finally { setGenerating(false); }
  }
  async function readBrandLogo() {
    if (!brandLogo) return undefined;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(brandLogo.type) || brandLogo.size > 1024 * 1024) throw new Error('Use uma logo PNG, JPG ou WebP de até 1 MB.');
    return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Não foi possível ler a logo.')); reader.readAsDataURL(brandLogo); });
  }
  async function uploadReferences() {
    const data = new FormData(); data.append('name', newName.trim());
    references.forEach(file => data.append('references', file));
    if (brandLogo) data.append('logo', brandLogo);
    const response = await fetch('/api/criativos/salvar-referencias', { method: 'POST', body: data });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Não foi possível salvar as imagens.');
    return body.folder as string;
  }
  async function saveReferences() {
    if (analyzing) return;
    if (!newName.trim() || !references.length || references.length > 8) { setNotice('Informe o nome e selecione de 1 a 8 imagens de referência.'); return; }
    setAnalyzing(true);
    try {
      const logoData = await readBrandLogo();
      const referenceFolder = await uploadReferences();
      const updated = [...profiles, { id: crypto.randomUUID(), name: newName.trim(), colors: '', notes: '', logoData, referenceFolder }];
      try { localStorage.setItem(`criativo-perfis-${userId}`, JSON.stringify(updated)); } catch { throw new Error('Não há espaço no navegador para salvar o cliente. Tente uma logo menor.'); }
      setProfiles(updated); setNotice('Cliente, referências e logo selecionada foram salvos. A análise por IA ainda não foi realizada.');
      setNewName(''); setReferences([]); setBrandLogo(null);
      const refsInput = document.getElementById('brand-references') as HTMLInputElement | null;
      const logoInput = document.getElementById('brand-logo') as HTMLInputElement | null;
      if (refsInput) refsInput.value = ''; if (logoInput) logoInput.value = '';
    } catch (error) { setNotice(error instanceof TypeError ? 'Não foi possível conectar ao servidor local.' : error instanceof Error ? error.message : 'Não foi possível salvar as imagens.'); }
    finally { setAnalyzing(false); }
  }
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (analyzing || !newName.trim()) return;
    if (!references.length || references.length > 8) { setNotice('Selecione de 1 a 8 imagens de referência.'); return; }
    if (!apiKey.trim()) { setNotice('Configure a chave da API OpenAI em Configurações para analisar as referências.'); return; }
    if (brandLogo && (!['image/png', 'image/jpeg', 'image/webp'].includes(brandLogo.type) || brandLogo.size > 1024 * 1024)) { setNotice('Use uma logo PNG, JPG ou WebP de até 1 MB.'); return; }
    setAnalyzing(true); setNotice('');
    try {
      const data = new FormData(); data.append('apiKey', apiKey);
      references.forEach(file => data.append('references', file));
      const response = await fetch('/api/criativos/analisar-marca', { method: 'POST', body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Não foi possível analisar as referências.');
      const analysis: Analysis = body.analysis;
      const notes = `Resumo: ${analysis.summary}\nTipografia: ${analysis.typography}\nEstilo: ${analysis.style}\nComposição: ${analysis.composition}\nElementos: ${analysis.elements}`;
      const logoData = await readBrandLogo();
      const referenceFolder = await uploadReferences();
      const updated = [...profiles, { id: crypto.randomUUID(), name: newName.trim(), colors: analysis.colors, notes, analysis, logoData, referenceFolder }];
      try { localStorage.setItem(`criativo-perfis-${userId}`, JSON.stringify(updated)); } catch { throw new Error('Não há espaço no navegador para salvar o cliente. Tente uma logo menor.'); }
      setProfiles(updated);
      setNewName(''); setReferences([]); setBrandLogo(null);
      const logoInput = document.getElementById('brand-logo') as HTMLInputElement | null;
      if (logoInput) logoInput.value = '';
      const input = document.getElementById('brand-references') as HTMLInputElement | null;
      if (input) input.value = '';
      setNotice('Cliente cadastrado e identidade analisada. Confira o resultado abaixo.');
    } catch (error) { setNotice(error instanceof TypeError ? 'Não foi possível conectar ao servidor local. Recarregue a página e tente novamente.' : error instanceof Error ? error.message : 'Não foi possível analisar as referências.'); }
    finally { setAnalyzing(false); }
  }

  return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-icon"><Building2 size={20}/></div><div><strong>criativo<span>.</span></strong><small>ESTÚDIO IMOBILIÁRIO</small></div></div><div className="side-label">ESPAÇO DE TRABALHO</div><nav>{([{id:'criar',label:'Criar arte',icon:Sparkles},{id:'perfis',label:'Clientes e marcas',icon:UsersRound},{id:'historico',label:'Histórico',icon:Clock3},{id:'configuracoes',label:'Configurações',icon:Settings2}] as const).map(item => <button key={item.id} title={item.label} aria-label={item.label} className={tab===item.id?'active':''} onClick={() => {setTab(item.id);setNotice('')}}><item.icon size={18}/>{item.label}</button>)}{isAdmin && <button title="Administração" aria-label="Administração" onClick={onAdmin}><Settings2 size={18}/>Administração</button>}<button title="Sair" aria-label="Sair" onClick={onLogout}>↪ Sair</button></nav><div className="side-bottom"><div className="side-tip"><Sparkles size={17}/><strong>Seu estúdio criativo</strong><p>Um novo jeito de apresentar imóveis.</p></div><div className="user"><div className="avatar">{userName.charAt(0).toUpperCase()}</div><div><strong>{userName}</strong><small>Prévia local</small></div></div></div></aside>
  <main className="main"><header className="topbar"><div><span>ESPAÇO DE CRIAÇÃO</span><p>Imobiliário <span className="slash">/</span> {tab === 'criar' ? 'Criar arte' : tab === 'perfis' ? 'Clientes e marcas' : tab === 'historico' ? 'Histórico' : 'Configurações'}</p></div><div className="topright"><i/> AMBIENTE DE TESTE</div></header><div className="content">
  {notice && <div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Fechar aviso"><X size={16}/></button></div>}
  {tab === 'criar' && <><div className="page-head"><div><div className="eyebrow"><Sparkles size={14}/> CRIE COM INTENÇÃO</div><h1>Uma boa imagem <em>vende mais.</em></h1><p>Transforme os detalhes do seu imóvel em uma apresentação que chama atenção.</p></div><div className="step-label">SEU ESTÚDIO <ArrowUpRight size={15}/></div></div>
  <div className="layout"><div className="form-column">
  <section className="card"><div className="section-top"><div className="number">01</div><div><h2>Para qual cliente?</h2><p>Escolha a marca que será usada nesta criação.</p></div></div><label className="field-label" htmlFor="profile">CLIENTE</label><select id="profile" value={profileId} onChange={e=>{setProfileId(e.target.value);setLogo(null);setLogoVersion('')}}><option value="">Criar sem cliente</option>{profiles.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select>{selectedProfile?.analysisStale && <p className="client-status">As referências deste cliente foram alteradas. Atualize a análise na ficha para usá-la novamente.</p>}<p className="mini-note" style={{textAlign:'left',marginTop:10}}>{selectedProfile?.logoData && !logo ? 'A logo cadastrada será usada automaticamente.' : selectedProfile ? 'Este cliente está sem logo cadastrada.' : 'Você também pode criar sem escolher uma marca.'}</p>{selectedProfile?.logos?.length ? <><label className="field-label spacer" htmlFor="logo-version">VERSÃO DA LOGO</label><select id="logo-version" value={logoVersion} onChange={e=>setLogoVersion(e.target.value)}><option value="">Logo principal</option>{selectedProfile.logos.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></> : null}<label className="field-label spacer" htmlFor="logo">OUTRA LOGO PARA ESTA ARTE · OPCIONAL</label><input key={profileId} id="logo" className="file-field" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setLogo(e.target.files?.[0]||null)}/><button type="button" className="client-link" onClick={()=>{setClientDetailId(selectedProfile?.id || '');setTab('perfis');setNotice('')}}>{selectedProfile ? 'Ver ficha do cliente' : 'Cadastrar cliente'}</button></section>
  <section className="card"><div className="section-top"><div className="number">02</div><div><h2>Imagens do imóvel</h2><p>Escolha até duas fotos. Elas serão a base da composição.</p></div></div><label className="drop"><ImagePlus size={24}/><strong>Adicionar fotos</strong><span>PNG, JPG ou WebP · até 2 imagens</span><input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e=>{const files=Array.from(e.target.files||[]);if(files.length>2){setNotice('Selecione no máximo duas fotos.');return}setPhotos(files);setNotice('')}}/></label>{urls.length>0 && <div className="thumbs">{urls.map((u,i)=><div key={u}><img src={u} alt={`Foto ${i+1}`}/><button aria-label={`Remover foto ${i+1}`} onClick={()=>setPhotos(photos.filter((_,j)=>j!==i))}><X size={14}/></button></div>)}</div>}</section>
  <section className="card"><div className="section-top"><div className="number">03</div><div><h2>Conte sobre o imóvel</h2><p>Inclua os detalhes que precisam aparecer na arte.</p></div></div><label className="field-label" htmlFor="desc">{segment === 'Original' ? 'INFORMAÇÕES EXATAS PARA A ARTE' : 'DESCRIÇÃO E LOCALIZAÇÃO'}</label><textarea id="desc" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Ex.: Apartamento no Bessa, 3 quartos, varanda e vista para o mar." rows={4}/></section>
  <section className="card"><div className="section-top"><div className="number">04</div><div><h2>Estilo e formato</h2><p>Escolha Original para seguir uma referência do cliente ou selecione outro estilo.</p></div><span>OPCIONAL</span></div><div className="segments">{SEGMENTS.map((name,i)=><button key={name} className={segment===name?'selected':''} onClick={()=>setSegment(segment===name?'':name)}><span className="seg-icon">{['✳','◒','✳','◇','▱','↗','✿'][i]}</span><strong>{name}</strong>{segment===name && <Check size={14}/>}</button>)}</div><div className="field-label spacer">FORMATO DA ARTE</div><div className="formats">{SIZES.map((s,i)=><button key={s.name} className={format===i?'selected':''} onClick={()=>setFormat(i)}><strong>{s.name}</strong><span>{s.size}</span></button>)}</div><label className="switch-row"><span><strong>Expansão de céu</strong><small>{segment==='Original' ? 'Ainda não disponível no modo Original.' : 'Crie mais espaço visual preservando o imóvel.'}</small></span><input type="checkbox" disabled={segment==='Original'} checked={segment==='Original'?false:sky} onChange={e=>setSky(e.target.checked)}/></label></section>
  {segment === 'Original' ? <OriginalPanel onSaveVariant={(image,warnings,title,professional,referenceFile,referenceLabel,formatIndex,draft)=>void saveArtwork(image,{draft,description,segment:'Original',format:SIZES[formatIndex].size,profileId:selectedProfile?.id,profileName:selectedProfile?.name,title,professional,referenceFile,referenceLabel,warnings})} reuse={reuse} clientFont={selectedProfile?.fontData} clientFontName={selectedProfile?.fontName} folder={selectedProfile?.referenceFolder} clientName={selectedProfile?.name} photo={photos[0] || null} secondPhoto={photos.length > 1} logo={logo || selectedProfile?.logos?.find(item=>item.id===logoVersion)?.data || selectedProfile?.logoData || null} details={description} apiKey={apiKey} format={format} onInvalidate={()=>{setGeneratedImage('');setOriginalWarnings([]);}} onResult={(image,warnings,title,professional,referenceFile,referenceLabel,draft)=>{setGeneratedImage(image);setOriginalWarnings(warnings);setPrompt('');void saveArtwork(image,{draft,description,segment:'Original',format:SIZES[format].size,profileId:selectedProfile?.id,profileName:selectedProfile?.name,title,professional,referenceFile,referenceLabel,warnings});}} /> : <button className="primary" disabled={generating} onClick={compose}><Sparkles size={18}/> {generating ? 'Gerando criativo…' : 'Gerar criativo'} <ArrowUpRight size={18}/></button>}<p className="footnote">{segment === 'Original' ? 'A foto e a logo são montadas pela aplicação; revise posição, contraste e composição.' : 'O formato da imagem gerada nesta versão é 1024 × 1024 ou 1024 × 1536. Confira a arte antes de publicar.'}</p></div>
  <aside className="preview-column"><div className="preview-heading"><div><span>PRÉ-VISUALIZAÇÃO</span><h2>Seu próximo criativo</h2></div><span className="ratio">{SIZES[format].ratio}</span></div><div className="preview-frame">{generatedImage ? <img src={generatedImage} alt="Criativo imobiliário gerado"/> : urls[0] ? <><img src={urls[0]} alt="Prévia da foto do imóvel"/><div className="preview-overlay"><span>FOTO ORIGINAL</span><p>{generating ? 'Criando sua arte…' : 'A arte gerada aparecerá aqui.'}</p></div></> : <div className="empty-preview"><div><ImagePlus size={27}/></div><strong>O começo de algo especial</strong><p>Adicione uma foto para visualizar sua composição.</p></div>}</div><div className="preview-caption"><span>◌</span> {generatedImage ? 'Confira os detalhes antes de usar.' : 'A imagem acima é apenas a prévia da foto original.'}</div>{generatedImage && segment === 'Original' && originalWarnings.length > 0 && <div className="original-review" role="status"><strong>Revisão necessária</strong><ul>{originalWarnings.map((warning,i)=><li key={i}>{warning}</li>)}</ul></div>}{pendingSave && <button type="button" className="reference-save" onClick={()=>void saveArtwork(pendingSave.image,pendingSave.data)}>Tentar salvar no histórico novamente</button>}{generatedImage && <a className="primary" href={generatedImage} download="criativo-imobiliario.png">Baixar criativo</a>}{prompt && <div className="prompt-box"><div><strong>Instruções enviadas</strong><button onClick={async()=>{try{await navigator.clipboard.writeText(prompt);setNotice('Prompt copiado.')}catch{setNotice('Não foi possível copiar; selecione o texto manualmente.')}}}><Copy size={15}/> Copiar</button></div><textarea readOnly value={prompt} rows={9}/></div>}<div className="preview-note"><span>✳</span><div><strong>Feito para o mercado imobiliário</strong><p>Cada detalhe pensado para valorizar o que torna seu imóvel único.</p></div></div></aside></div></>}
  {tab==='perfis' && detailProfile && <ClientDetail profile={detailProfile} history={allHistory} onDeleteHistory={deleteHistory} onReuseHistory={reuseArtwork} apiKey={apiKey} onBack={()=>setClientDetailId('')} onSave={saveClient} onRemove={removeClient} onCreate={()=>{setProfileId(detailProfile.id);setLogo(null);setTab('criar');setNotice('')}} />}
  {tab==='perfis' && !detailProfile && <><div className="page-head"><div><div className="eyebrow">IDENTIDADE VISUAL</div><h1>Clientes e <em>marcas.</em></h1><p>Cadastre cada cliente e reúna as orientações de marca para suas próximas criações.</p></div></div><div className="profile-grid"><form className="card" onSubmit={saveProfile}><div className="section-top"><div className="number"><Plus size={17}/></div><div><h2>Cadastrar cliente</h2><p>Adicione as informações da identidade visual.</p></div></div><label className="field-label">NOME DO CLIENTE</label><input value={newName} onChange={e=>setNewName(e.target.value)} required placeholder="Nome da imobiliária"/><label className="field-label spacer" htmlFor="brand-logo">LOGO DO CLIENTE · OPCIONAL</label><input id="brand-logo" className="file-field" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setBrandLogo(e.target.files?.[0] || null)}/><p className="mini-note">PNG, JPG ou WebP de até 1 MB. A logo será usada nas criações deste cliente.</p><label className="field-label spacer" htmlFor="brand-references">IMAGENS DE REFERÊNCIA</label><input id="brand-references" className="file-field" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e=>setReferences(Array.from(e.target.files||[]))}/><p className="mini-note">{references.length ? `${references.length} imagem(ns) selecionada(s). ` : ''}Envie de 1 a 8 imagens. A análise por IA identifica a identidade visual; você também pode salvar sem analisar.</p><button type="button" className="reference-save" onClick={saveReferences} disabled={analyzing}>Salvar cliente sem análise</button><button className="primary" type="submit" disabled={analyzing}>{analyzing ? 'Analisando referências…' : 'Analisar e cadastrar cliente'}</button></form><div><h2 className="subheading">Clientes cadastrados <span>{profiles.length}</span></h2>{profiles.length===0?<div className="profile-empty">Nenhum cliente cadastrado.<p>Cadastre seu primeiro cliente para organizar suas preferências.</p></div>:profiles.map(p=><button className="client-list-item" key={p.id} onClick={()=>{setClientDetailId(p.id);setNotice('')}}><div className="client-list-logo">{p.logoData?<img src={p.logoData} alt=""/>:<span>{p.name.slice(0,1).toUpperCase()}</span>}</div><div><strong>{p.name}</strong><p>{p.analysisStale ? 'Análise precisa ser atualizada' : p.analysis ? 'Identidade analisada' : 'Análise pendente'}</p></div><span className="client-list-action">Ver cliente</span></button>)}</div></div></>}
  {tab==='configuracoes' && <><div className="page-head"><div><div className="eyebrow">PREFERÊNCIAS DO ESTÚDIO</div><h1>Configurações <em>de IA.</em></h1><p>Configure a integração usada na análise das marcas e na criação das artes.</p></div></div><section className="card settings-card"><label className="field-label" htmlFor="api-key">CHAVE DA API OPENAI · TESTE LOCAL</label><input id="api-key" type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} autoComplete="off" placeholder="Cole sua chave da API OpenAI"/><p className="mini-note">A chave fica somente nesta aba e será apagada ao recarregar a página. A análise e a geração usam créditos da API.</p><button className="reference-save" onClick={()=>{setTab('perfis');setNotice('')}}>Voltar aos clientes</button></section></>}
  {tab==='historico' && <><div className="page-head"><div><div className="eyebrow">SEU PROCESSO CRIATIVO</div><h1>Histórico de <em>artes.</em></h1><p>Consulte e baixe suas criações salvas neste computador.</p></div></div><div className="card history">{historyError && <p role="alert">{historyError}</p>}<HistoryList entries={allHistory} onDelete={deleteHistory} onReuse={reuseArtwork}/><p className="mini-note">As novas artes são salvas neste computador. Registros anteriores podem não conter a imagem.</p></div></> }
  </div></main></div>;
}
