# Documentação visual — análise do Excalidraw

Fonte: `documentacao_excalidraw.excalidraw`, enviada por Kaua em 18/11/2026. O arquivo contém anotações e capturas de referência. As capturas mostram uma interface de exemplo; não demonstram implementação no projeto local nem definem automaticamente planos ou preços do novo sistema.

## Objetivo descrito

Site para informar imagem, descrição, logo e segmento, produzir criativos imobiliários, escolher o formato e reutilizar perfis de marca baseados em análises de posts anteriores. O material descreve uma solução para uso próprio; a eventual oferta comercial, planos e cobrança ainda precisam ser definidos.

## Tela de geração

1. **Segmento opcional:** Litoral, Alto Padrão, Populares, Terrenos, Lançamentos ou Rurais. Deixar sem seleção significa geração livre.
2. **Descrição e localização:** dados e características a considerar na arte.
3. **Imagens do imóvel:** até duas imagens, combinadas na composição; PNG, JPG ou WebP aparecem na referência.
4. **Logo opcional:** enviar a logo; a captura recomenda logo transparente. O texto menciona recuperar a logo cadastrada quando aplicável.
5. **Formato:** feed quadrado 1080×1080; feed esticado 1080×1350; Story/Reels 1080×1920.
6. **Prompt céu:** opção para expansão do céu, preservando a fidelidade do imóvel.
7. **Pré-visualização:** área onde a imagem aparece após a geração.

O formato é uma configuração da geração, não uma dimensão fixa única. A disponibilidade real de cada dimensão na API e o modo de entregar a resolução exata devem ser validados sem distorcer nem cortar o imóvel indevidamente.

## Perfil de marca

O usuário cria um perfil, envia imagens de referência para a IA analisar e recebe informações sobre resumo da marca, cores, tipografia, estilo visual e elementos recorrentes. Um perfil analisado pode ser selecionado novamente na tela principal para reutilizar suas configurações nas próximas artes. A captura mostra logo, galeria de exemplos e opção de refazer análise; o exemplo mostra 8 de 10 imagens e mínimo de 5, mas esses limites aparecem numa referência e ainda precisam ser confirmados como regra do novo sistema.

## Histórico e conta

- O diagrama pede histórico de imagens produzidas e dados associados a cada cliente cadastrado, com isolamento apropriado entre contas.
- Uma captura de referência mostra nome, e-mail, créditos, assinatura e saída da conta. Não presumir que preços, saldos, limites de perfil, cobrança ou assinaturas já estão aprovados: confirmar se serão necessários para a primeira versão de uso próprio.

## Organização dos prompts

O material separa prompt base, bloco do segmento, condições de logo, formato, descrição, identificador e expansão de céu. A análise de identidade também deve orientar as próximas criações do perfil. Ver `PROMPTS-E-ESTILOS.md` para os blocos já recebidos e `REGRAS-DE-NEGOCIO.md` para requisitos e pendências.

## Limitações e pendências

- O Excalidraw é documentação visual e contém exemplos com marcas e dados de terceiros; não é o backend ou código executável do produto.
- Confirmar a escolha de provedor/modelo e o acesso à API para teste no sistema. A conversa usa a ferramenta própria do assistente, que não equivale a uma chave de API para o aplicativo.
- Definir a prioridade em caso de divergência entre o perfil de marca e o estilo selecionado; as condições para novas análises; e como garantir isolamento e persistência de arquivos e histórico.
- A geração por IA pode alterar detalhes e texto mesmo quando instruída a preservar a foto; validar resultados com o usuário antes de prometer fidelidade exata.
