# BF-AUDITORIA-ARQUITETURA — MailSignatureStudio
# Playbook: Auditoria Estrutural e Arquitetural

## 1. Escopo da Auditoria
Este playbook serve para auditar a conformidade estrutural do MailSignatureStudio com as regras de engenharia definidas em `AGENTS.md` e `INSTALL.md`.

---

## 2. Matriz de Auditoria Estrutural

| Componente | Verificação | Critério de Sucesso |
| :--- | :--- | :--- |
| **Domínio** | Independência de frameworks | `src/domain/` não importa `react`, `react-dom` nem acede ao DOM. |
| **Segurança** | Sanitização contra XSS | Todos os nós dinâmicos em HTML utilizam `escapeHtml` e `sanitizeUrl`. |
| **Persistência** | Resiliência de importação | `normalizeSignatureState` tolera JSON corrompido ou parcial sem lançar erros. |
| **Exportação** | Dualidade de Clipboard | A pré-visualização copia simultaneamente `text/html` e `text/plain`. |
| **Docker** | Multi-stage build | Stage 1 executa testes, verificação de tipos e build; Stage 2 publica via Nginx leve. |
| **Nginx** | Cabeçalhos de segurança | `nginx.conf` define `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy`. |
| **REA** | Ferramenta de evidências | `scripts/rea-inspect.sh` é executável e respeita o diretório `docs/rea-evidence`. |

---

## 3. Checklist de Auditoria Periódica
1. Executar verificação estática:
   ```bash
   npm run typecheck && npm test && npm run build
   ```
2. Testar sanitização de URLs com vetores de ataque conhecidos (`javascript:`, `vbscript:`, `data:`).
3. Testar restauração de estado local apagando a chave no `localStorage` e verificando fallback para `DEFAULT_SIGNATURE_STATE`.
4. Verificar se a imagem Docker compila sem avisos críticos.
