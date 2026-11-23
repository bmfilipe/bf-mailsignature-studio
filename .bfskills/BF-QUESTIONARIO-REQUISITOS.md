# BF-QUESTIONARIO-REQUISITOS — MailSignatureStudio
# Playbook: Levantamento de Requisitos e Escopo

## 1. Objetivo
Estruturar a definição de requisitos de novas funcionalidades, extensões de templates e melhorias no MailSignatureStudio, assegurando alinhamento com a arquitetura local-first e compatibilidade com clientes de e-mail.

---

## 2. Questionário de Enquadramento

### 2.1 Compatibilidade de E-mail
1. **Quais os clientes de e-mail prioritários para a nova funcionalidade?**
   - [ ] Gmail (Web / App móvel)
   - [ ] Microsoft Outlook (Web / Novo Outlook / Clássico Win32 com motor Word)
   - [ ] Apple Mail (macOS / iOS)
   - [ ] Thunderbird / Outros
2. **O elemento pretendido é suportado por tabelas HTML sem CSS moderno (`flexbox`/`grid`)?**
   - Se requerer propriedades não suportadas, qual é o layout alternativo de fallback?

### 2.2 Modelo de Dados e Persistência
1. **Que novos campos são necessários em `SignatureState`?**
2. **Existe retrocompatibilidade com versões anteriores gravadas em `localStorage`?**
3. **Qual é o comportamento padrão se o utilizador importar um JSON que omite estes novos campos?**

### 2.3 Segurança e Sanitização
1. **Os campos aceitam entradas livres de utilizador (texto, URLs, cores)?**
2. **Que protocolos são permitidos para novos links ou imagens (`https:`, `http:`, `mailto:`, `tel:`)?**
3. **Existe risco de injeção XSS se o HTML for colado ou renderizado no browser?**

### 2.4 Experiência do Utilizador (Editor & Pré-visualização)
1. **Em que separador da barra lateral deve residir o controlo (Templates, Detalhes, Imagens, Social, Design, Extras)?**
2. **Como se comporta a pré-visualização em modo Light e Dark?**
3. **A alteração gera avisos no compilador (`warnings: string[]`) em caso de valor inválido?**

---

## 3. Critérios de Aceitação Obrigatórios
- [ ] O compilador gera HTML estrito baseado em `<table>` e CSS inline.
- [ ] A sanitização de inputs rejeita esquemas `javascript:` e escapa tags `<script>` e entidades HTML.
- [ ] Novos campos são integrados na função `normalizeSignatureState` com valores padrão.
- [ ] Foram adicionados testes unitários correspondentes em `emailHtmlCompiler.test.ts`.
