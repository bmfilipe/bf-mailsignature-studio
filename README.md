# MailSignatureStudio

Editor web local-first para criação, pré-visualização (Light/Dark) e exportação de assinaturas de e-mail em HTML compatível com clientes de correio eletrónico (Gmail, Outlook, Apple Mail), concebido sob o perfil **REA + Recriação Equivalente**.

## Objetivos e Princípios
- **Paridade Funcional Sem Cópia de Ativos:** Inspiração estrutural em fluxos de editores de assinaturas web analisados via `morluto/rea`, mas com marca, schemas, componentes e ativos 100% próprios.
- **HTML Email-Safe:** Geração de assinaturas baseadas em `<table>` e CSS inline estrito, evitando propriedades que clientes de e-mail descartam (`flexbox`, `grid`, estilos externos complexos).
- **Local-First & Resiliente:** Persistência imediata no browser (`localStorage`), exportação/importação de rascunhos em JSON, cópia em *Rich Text* (`text/html` + `text/plain`) e HTML bruto.

## Início Rápido (Local)
```bash
cp .env.example .env
npm install
npm test
npm run dev
```

## Publicação com Docker / Nginx
```bash
docker compose up -d --build
```
