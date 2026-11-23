# INSTALL — MailSignatureStudio

Guia de instalação do ambiente, configuração de variáveis, integração com `.bfskills/` e deploy em contentor.

## 1. Pré-requisitos
- **Node.js** `>= 20` e **npm** (ou pnpm/bun).
- **Python** `>= 3.10` (para scripts auxiliares e inicialização).
- **Docker** e **Docker Compose** (opcional, para publicar via Nginx).
- Acesso ao `morluto/rea` (CLI ou MCP server configurado no teu ambiente) caso pretendas executar a fase de inspeção/evidências.

## 2. Configuração do Projeto
```bash
cp .env.example .env
npm install
npm run dev
```

## 3. Playbooks `.bfskills/`
Os playbooks de engenharia residem em `.bfskills/` e estão ligados ao fluxo global através do ficheiro `AGENTS.md`:
- `.bfskills/BF-QUESTIONARIO-REQUISITOS.md`
- `.bfskills/BF-ESPECIFICACAO-TECNICA.md`
- `.bfskills/BF-IMPLEMENTAR-CODIGO.md`
- `.bfskills/BF-DESENVOLVIMENTO-TESTING.md`
- `.bfskills/BF-REVISAO-CODIGO.md`
- `.bfskills/BF-AUDITORIA-ARQUITETURA.md`

## 4. Testes, Verificação de Tipos e Build
```bash
npm test
npm run typecheck
npm run build
docker compose up -d --build
```
