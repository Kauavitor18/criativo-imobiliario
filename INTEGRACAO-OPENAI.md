# Integração de teste com OpenAI

Kaua quer testar a geração dentro do sistema usando OpenAI. A prévia atual é apenas uma página de divulgação, sem API de geração. A ferramenta de imagens disponível nesta conversa não é uma credencial que possa ser incorporada ao aplicativo.

Para uma geração real a partir da interface é necessário implementar um backend, fornecer credenciais próprias da API OpenAI ao servidor e encaminhar a foto e o prompt à API de edição de imagens. A chave deve permanecer no servidor. A conta e o modelo precisam ter acesso habilitado; o uso da API pode gerar custos.

O fluxo de teste precisa aceitar foto(s), descrição, estilo, logo opcional e expansão de céu, devolver a imagem e permitir revisão/download. As dimensões da API e a fidelidade do imóvel, texto e logo devem ser verificadas antes de prometer o formato 1080×1350 ou reprodução exata.
