# BF-DESENVOLVIMENTO-TESTING — MailSignatureStudio
# Playbook: Testes e Validação Contínua

## 1. Estratégia de Testes

### 1.1 Testes Unitários Automatizados (Vitest)
Os testes unitários residem em `src/domain/emailHtmlCompiler.test.ts` e devem cobrir obrigatoriamente:
- **Compatibilidade de Layout:**
  - Garantir ausência de regras modernas descartadas por clientes de e-mail (ex: `display: flex`, `display: grid`).
  - Validar a presença de tabelas `<table>`, linhas `<tr>` e células `<td>` bem formadas.
- **Segurança e Sanitização:**
  - Mitigação de XSS: garantir que tags `<script>`, `<svg onload=...>`, atributos inline e entidades HTML são escapadas.
  - Bloqueio de esquemas perigosos: rejeitar explicitamente `javascript:`, `vbscript:`, `data:` e URLs malformadas.
- **Comportamento Condicional:**
  - Validar que secções desativadas (redes sociais, banners, CTAs, disclaimers) não produzem nós HTML nem linhas de texto simples desnecessárias.
  - Validar que o `plainText` gerado reflete com precisão os dados visíveis.

### 1.2 Comandos de Validação Local
```bash
# Executar todos os testes unitários uma vez
npm test

# Executar testes em modo observação durante desenvolvimento
npm run test:watch

# Validação estrita de tipos TypeScript
npm run typecheck

# Validação de build completo de produção
npm run build
```

---

## 2. Testes Manuais de Compatibilidade em Clientes de E-mail

Ao introduzir um novo template ou elemento de design, realiza o seguinte procedimento manual:
1. **Cópia em Rich Text:**
   - Clica no botão "Copiar Assinatura" na pré-visualização.
   - Cola no editor de assinaturas do **Gmail** e envia um e-mail de teste.
   - Cola no editor do **Outlook Web / App** e envia um e-mail de teste.
   - Inspeciona o e-mail recebido em clientes móveis (iOS Mail, Gmail Android).
2. **Verificação Visual:**
   - O alinhamento vertical das imagens mantém-se consistente?
   - As fontes de fallback funcionam corretamente se a fonte principal não estiver instalada?
   - Os links são clicáveis e apontam para os destinos corretos?
