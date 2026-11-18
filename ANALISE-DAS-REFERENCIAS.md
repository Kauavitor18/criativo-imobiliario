# Análise dos ZIPs de referência

Analisados em 18/11/2026 a partir dos arquivos fornecidos por Kaua. São referências para o novo Criativo Imobiliário; não foi estabelecido que qualquer conteúdo de terceiros, marca, preço ou depoimento deva ser publicado.

## Artes Imobiliárias — Gerador de Criativos

Fonte: `artes-imobiliárias---gerador-de-criativos.zip`, extraída em `referencias/artes-imobiliarias/`.

- Aplicação de página única em React, TypeScript e Vite. `App.tsx` compõe navegação, chamada principal, prova social, vídeo demonstrativo, portfólio, recursos, segmentos, fluxo de uso, depoimentos, planos, perguntas frequentes e rodapé.
- Apresenta a proposta de transformar fotos de imóveis em artes com IA. A seção de funcionamento sugere selecionar segmento, enviar foto, inserir informações e gerar/baixar.
- Os componentes apresentam estilos e segmentos, além de ideias comerciais como planos, créditos mensais, assinatura e diferentes formatos. São informações do modelo de referência; não constituem decisões aprovadas para o novo produto.
- O código extraído contém a interface de divulgação, não um gerador operacional completo. Não foram encontrados cadastro e análise de clientes, upload operacional, autenticação real, histórico, pagamentos, API de geração ou integração funcional de IA nos arquivos examinados. Alternância de preços e abertura de FAQ têm estado local; isso não comprova contratação de planos.
- O portfólio usa imagens externas de demonstração, embora a interface as apresente como exemplos reais; há métricas, depoimentos e contatos fixos na página. Não tratar esses textos ou números como fatos do produto de Kaua.

## DEITH — Creative Studio

Fonte: `deith-_-creative-studio.zip`, extraída em `referencias/deith-creative-studio/`.

- Aplicação React, TypeScript e Vite de apresentação de um estúdio criativo. O app usa estado local para navegar entre a página inicial, contato, portfólio e categorias comercial, social, eventos e casamentos.
- A direção visual é escura, com tipografia de destaque, vídeos, portfólio e navegação por categorias. Pode servir como referência de apresentação e experiência visual, conforme a escolha de Kaua.
- Fotos, vídeos, logos e textos apontam para recursos e marcas de terceiros. O ZIP não contém o gerador imobiliário nem prova direito de reutilização desses materiais.

## Diferença entre referências e sistema desejado

Os prompts e regras recebidos descrevem uma aplicação para gerar criativos imobiliários, cadastrar clientes e analisar exemplos de identidade visual. Os dois ZIPs mostram interfaces de apresentação e referências de experiência; os fluxos de cadastro de clientes, análise visual e geração precisam ser construídos ou integrados separadamente.

As dependências não foram instaladas e os aplicativos não foram executados nesta análise. Os projetos dependem de recursos externos, inclusive Tailwind via CDN e mídias de terceiros. Os ZIPs incluem arquivos `.env.local`; seus conteúdos não foram examinados nem copiados para documentação. Ambos os arquivos `vite.config.ts` contêm configuração que injeta variáveis de API no código do frontend: não reutilizar esse padrão para segredos no sistema final.

## Pontos a definir com Kaua quando fornecer a estrutura

- Papel de cada referência na identidade e nas telas do novo sistema, inclusive se serão combinadas.
- Área interna: fluxo de clientes e análise, criação por imóvel, seleção de estilo, revisão, histórico e download.
- Política de preços, créditos e formatos: exemplos da página não são regras aprovadas.
- Arquitetura, provedor de IA, persistência, autenticação e implementação que preserve foto e logo.
