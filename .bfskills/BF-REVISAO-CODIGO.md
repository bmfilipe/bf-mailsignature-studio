# BF-REVISAO-CODIGO — MailSignatureStudio
# Playbook: Revisão de Qualidade, Estilo e Segurança

## 1. Critérios de Avaliação de Pull Request / Alteração

### 1.1 Segurança (Severidade Alta)
- [ ] Todas as interpolações de strings de utilizador no compilador HTML passam por `escapeHtml`.
- [ ] Todos os URLs em atributos `href` e `src` passam por `sanitizeUrl` com lista estrita de protocolos permitidos.
- [ ] Não existem dependências de bibliotecas externas no compilador (`emailHtmlCompiler`).
- [ ] A função `normalizeSignatureState` trata entradas `unknown` com resiliência, sem provocar exceções de tipo ou travamentos no browser.

### 1.2 Compatibilidade de E-mail (Severidade Média)
- [ ] O HTML gerado utiliza apenas estilos inline em tags `<td>`, `<span>`, `<a>` e `<img>`.
- [ ] Nenhuma regra CSS utiliza `display: flex`, `grid`, `position: absolute`, ou classes externas não embutidas.
- [ ] As imagens têm dimensões fixas ou limites explícitos (`max-width: 100%`) para evitar expansões indesejadas em ecrãs móveis.
- [ ] O `role="presentation"` está incluído na tabela principal para acessibilidade.

### 1.3 Qualidade e Manutenibilidade do Código (Severidade Normal)
- [ ] O código cumpre as regras do `tsconfig.json` (`strict: true`, `noUnusedLocals: true`, `noUncheckedSideEffectImports: true`).
- [ ] Componentes de UI utilizam Tailwind CSS de forma coesa com o tema escuro da aplicação.
- [ ] As mutações de estado na store mantêm imutabilidade e persistência fiável em `localStorage`.
- [ ] Não há `console.log` deixado em produção ou dados sensíveis em comentários.

---

## 2. Decisão de Aprovação
Apenas alterações que cumpram 100% dos critérios de segurança e compatibilidade de e-mail devem ser aprovadas para merge.
