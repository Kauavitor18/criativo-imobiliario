import React from 'react';
import type { Entry } from './client-types';

export default function HistoryList({entries,onDelete,onReuse}:{entries:Entry[];onDelete:(entry:Entry)=>void;onReuse?:(entry:Entry)=>void}) {
  if(!entries.length)return <div className="client-empty">Nenhuma criação neste histórico ainda.</div>;
  return <div className="art-history-grid">{entries.map(entry=><article className="art-history-card" key={entry.id}>
    {entry.savedImage ? <a href={`/api/historico/${entry.id}/imagem`} target="_blank" rel="noreferrer"><img src={`/api/historico/${entry.id}/imagem`} alt={`Arte de ${entry.profileName || 'criação'}`}/></a> : <div className="art-history-missing">Imagem não salva no histórico antigo</div>}
    <div className="art-history-info"><strong>{entry.title || entry.description || 'Arte sem descrição'}</strong><p>{entry.profileName || 'Sem cliente'} · {entry.segment} · {entry.format}</p><p>{entry.date}</p>
    {entry.referenceLabel && <p>Base: {entry.referenceLabel}</p>}
    {(entry.description || entry.professional || !!entry.warnings?.length) && <details><summary>Ver informações</summary>{entry.description && <p className="art-history-description">{entry.description}</p>}{entry.professional && <p>Identificação: {entry.professional}</p>}{entry.warnings?.map((warning,i)=><p key={i}>Aviso: {warning}</p>)}</details>}
    <div className="art-history-actions">{entry.savedImage && <><a href={`/api/historico/${entry.id}/imagem`} target="_blank" rel="noreferrer">Ver arte</a><a href={`/api/historico/${entry.id}/imagem`} download={`criativo-${entry.id}.png`}>Baixar</a></>}{onReuse && <button type="button" onClick={()=>onReuse(entry)}>Usar como base</button>}<button type="button" onClick={()=>onDelete(entry)}>Excluir</button></div></div>
  </article>)}</div>;
}
