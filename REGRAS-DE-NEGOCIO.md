# Criativo Imobiliário — regras de negócio iniciais

Registro de informações fornecidas por Kaua em 18/11/2026. Sistema em definição: não há implementação nem fornecedor de IA escolhido até o momento.

As referências recebidas em ZIP foram examinadas em `ANALISE-DAS-REFERENCIAS.md`; são interfaces demonstrativas e não comprovam que o gerador já esteja implementado.

O arquivo `documentacao_excalidraw.excalidraw` e seu resumo `ANALISE-EXCALIDRAW.md` documentam o painel de geração, perfis reutilizáveis e histórico.

## Objetivo

Criar peças publicitárias para imóveis a partir de fotos, descrição e configurações de estilo. O usuário poderá cadastrar clientes e fornecer exemplos de posts de cada um. O sistema deverá analisar os exemplos para identificar identidade visual, paleta, tipografia, composição e tratamento das imagens e usar essa análise como referência para novas peças do cliente.

## Clientes e identidade visual

- Kaua esclareceu em 23/11/2026: no cadastro, o usuário informa o nome do cliente e envia imagens de referência; o sistema identifica automaticamente paleta, características tipográficas, composição e estilo. O usuário não precisa preencher esses dados manualmente.
- Kaua pediu a opção **Original**: usar os posts enviados como referência principal de identidade visual, buscando fidelidade à composição, cores e tipografia do cliente. A logo original cadastrada deve acompanhar suas peças.
- Cadastrar um cliente e associar suas referências visuais; uma logo pode ser fornecida.
- Analisar os posts de referência e registrar, no mínimo, resumo da identidade, cores (principal, secundária, destaque e paleta), tipografia, estilo visual, elementos recorrentes e tags.
- Utilizar o perfil como referência na geração dos criativos desse cliente. A forma de combinar o perfil com cada estilo predefinido ainda será detalhada.
- A análise recebida como exemplo contém nome, estado `ready`, logo, quantidade de imagens, datas e resultado estruturado. IDs, URLs e dados do exemplo não devem se tornar padrões nem ser usados como contas reais do novo sistema.

## Geração de criativos

- Entrada exemplificada: uma ou duas imagens do imóvel, descrição do anúncio, estilo, logo opcional e opção de expansão de céu. Exemplos de descrição são dados de teste, não conteúdo fixo.
- Preservar a foto do imóvel, sua fidelidade visual e proporções; não distorcer, redesenhar ou substituir o imóvel. Não cortar ou alterar as proporções do prédio/imóvel. Em caso de duas imagens, mostrar ambas claramente em uma composição organizada.
- Não inventar informações sobre imóvel, preço ou benefícios que não tenham sido fornecidas.
- Direção geral: resultado profissional, contemporâneo e editorial; tipografia legível e hierarquia clara; contrastes adequados; evitar aparência genérica.
- Textos sobre gradientes suaves, leve desfoque ou sobreposições sutis. Não usar barras sólidas nem retângulos rígidos como áreas de texto; manter a parte inferior limpa e natural, sem reservar espaço vazio artificialmente.
- Detalhes informados, como preço, metragem, vantagens e descontos, podem ter destaque adicional, ícones e fundos para evidenciá-los. Conciliar esse destaque com a proibição de barras sólidas e blocos rígidos para texto.
- Recursos abstratos e luzes sutis são permitidos como decoração, sem competir com o imóvel. Quando não houver logo, não criar símbolos que representem marca.
- Regra padrão para todos os estilos: se o cliente possuir logo cadastrada, incluí-la automaticamente em todas as artes usando o arquivo original, sem deformação; preferir parte superior ou canto. Uma logo fornecida para a arte pode substituir a cadastrada. Sem logo: nenhuma palavra ou placeholder de logo, símbolo genérico de marca ou espaço reservado a ela.
- Formatos da documentação visual: feed quadrado 1080 × 1080, feed esticado 1080 × 1350 e Story/Reels 1080 × 1920. A entrega exata depende de validar o processamento e os formatos aceitos pelo modelo.
- Expansão de céu é um bloco opcional dos exemplos: restringir a alteração ao céu e preservar a fidelidade do imóvel. Trata-se de exceção delimitada à preservação literal da foto, não autorização para alterar o imóvel.
- Cada geração tem identificador único; os IDs recebidos são exemplos de execuções anteriores, não valores fixos.

## Estilos recebidos

As direções de segmento e as instruções textuais estão em `PROMPTS-E-ESTILOS.md`: alto padrão, litoral, lançamento, terreno, popular, rural e geração livre. Um exemplo chamado “TERRENO” usa `FREE_GENERATION`, enquanto outro usa `LAND_PLOTS`; preservar essa distinção e confirmar como a interface deve classificá-los.

## Ainda não definido

- Detalhamento completo da aplicação e fluxos de telas; a documentação Excalidraw já traz a estrutura inicial do gerador, perfis, histórico e conta.
- Forma de cadastro, armazenamento, edição e revisão do perfil visual; confirmação humana da análise.
- Provedor/modelo, geração, fidelidade de fotos e logo, custos, limites, autenticação, privacidade e permissões.
- Prioridade entre referências do cliente e estilos em caso de conflito; escolha de várias referências, revisão e regeneração.
- Como conciliar proporção de saída fixa, foto sem cortes, fotos de proporções diferentes e ausência de espaços vazios. A solução visual precisa respeitar a fidelidade do imóvel e ser definida com exemplos.
- Os exemplos demonstram prompts, não garantem que o gerador cumpra fielmente imagem, texto, logo ou dimensões. Esses resultados precisarão ser validados na implementação.
