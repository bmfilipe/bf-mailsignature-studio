# BF-IMPLEMENTAR-CODIGO — MailSignatureStudio
# Playbook: Diretrizes de Implementação de Código

## 1. Princípios de Implementação
1. **REA + Recriação Equivalente:**
   - Referências de design ou comportamento obtidas via `rea` devem ser recriadas com código, schemas e design originais.
   - Proibido importar ativos protegidos, marcas comerciais ou cópias diretas de código proprietário.
2. **Isolamento de Domínio:**
   - O compilador HTML não deve aceder ao DOM, `window`, `document` ou estados de React.
   - Deve ser uma função pura testável de forma determinística.
3. **Defesa em Profundidade:**
   - Nunca confiar no input do utilizador. Todo o texto deve passar por `escapeHtml`.
   - Todos os URLs devem passar por `sanitizeUrl` antes de serem atribuídos a `href` ou `src`.

---

## 2. Procedimento Passo a Passo para Novas Funcionalidades
1. **Atualizar Contratos de Domínio:**
   - Declarar os novos tipos em `src/domain/signature.types.ts`.
2. **Atualizar Compilador:**
   - Implementar a renderização em `src/domain/emailHtmlCompiler.ts` usando tabelas e CSS inline compatível.
   - Adicionar regras de aviso no array `warnings` quando entradas forem ignoradas por motivos de segurança ou formato.
3. **Escrever Testes Unitários:**
   - Em `src/domain/emailHtmlCompiler.test.ts`, criar casos de teste que validem renderização correta, estados desativados e rejeição de entradas maliciosas.
4. **Atualizar Store e Normalização:**
   - Atualizar `DEFAULT_SIGNATURE_STATE` e `normalizeSignatureState` em `src/store/useSignatureStore.ts`.
5. **Implementar Componentes de UI:**
   - Criar controlos nos respetivos separadores em `src/ui/components/tabs/`.
   - Garantir acessibilidade com labels semânticos e tags `<label>`.

---

## 3. Checklist Pré-Commit
- [ ] `npm test` passa com 100% de sucesso.
- [ ] `npm run typecheck` conclui sem erros de TypeScript (`tsc --noEmit`).
- [ ] `npm run build` compila o pacote estático para `dist/`.
