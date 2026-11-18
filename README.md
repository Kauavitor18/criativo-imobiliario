# Criativo Imobiliário

Protótipo local para criar peças imobiliárias e organizar referências de marca. A aplicação está em `referencias/artes-imobiliarias`.

```bash
cd referencias/artes-imobiliarias
npm ci
npm run dev -- --host 127.0.0.1 --port 5179
```

Abra `http://localhost:5179`. O primeiro acesso configura o administrador; usuários novos aguardam aprovação. Contas locais e credenciais não são incluídas no repositório.

A autenticação e a rota de geração foram implementadas como middleware do servidor de desenvolvimento Vite e destinam-se exclusivamente a testes locais. Não há backend de produção, autenticação pronta para exposição pública, nem persistência remota de perfis e histórico. Para gerar imagens, é necessária uma chave da API OpenAI; a ferramenta do assistente na conversa não é transferida ao aplicativo.

Documentos do projeto: `REGRAS-DE-NEGOCIO.md`, `PROMPTS-E-ESTILOS.md`, `ANALISE-EXCALIDRAW.md` e `ANALISE-DAS-REFERENCIAS.md`.
