# BF-ESPECIFICACAO-TECNICA — MailSignatureStudio
# Playbook: Arquitetura e Contratos Técnicos

## 1. Visão Geral da Arquitetura
O MailSignatureStudio adota uma arquitetura em camadas estritamente desacopladas:

```
[ UI Components (React 19) ]
       │
       ▼
[ Store / Estado Local (useSignatureStore) ] ── (localStorage / JSON I/O)
       │
       ▼
[ Compilador de Domínio (emailHtmlCompiler) ] ── (Função Pura: HTML / PlainText)
```

---

## 2. Camadas do Sistema

### 2.1 Camada de Domínio (`src/domain/`)
- **`signature.types.ts`**: Fonte única da verdade para tipagem.
  - `SignatureTemplateId`: identificador do modelo visual.
  - `SignatureDetails`, `SignatureImages`, `SocialLinkItem`, `SignatureAddons`, `SignatureTheme`.
  - `SignatureState`: agregado do estado completo de uma assinatura.
  - `CompiledSignature`: payload de saída contendo `{ html, plainText, warnings }`.
- **`emailHtmlCompiler.ts`**: Compilador funcional puro sem dependências externas:
  - `escapeHtml(value)`: escapa caracteres especiais (`&`, `<`, `>`, `"`, `'`).
  - `sanitizeUrl(url, allowedProtocols)`: valida e restringe protocolos.
  - `sanitizeHexColor(color, fallback)`: valida formatos hexadecimais (`#RGB` ou `#RRGGBB`).
  - `clampPx(val, min, max, fallback)`: garante intervalos seguros de dimensões em píxeis.
  - `compileSignatureHtml(state)`: orquestra a geração de tabelas e estilos inline.

### 2.2 Camada de Estado (`src/store/useSignatureStore.ts`)
- Mantém o estado reativo da assinatura no cliente.
- Sincroniza em tempo real com `localStorage` sob a chave `mailsignature_studio_state_v1`.
- `normalizeSignatureState`: função de hidratação defensiva que valida JSON externo desconhecido (`unknown`) contra o schema canónico.
- Exportação e importação de ficheiros e strings JSON.

### 2.3 Camada de Apresentação (`src/ui/`)
- **`App.tsx`**: Layout principal, gestão de modais de importação/exportação e guia de instalação.
- **`EditorSidebar.tsx`**: Controlo de separadores e formulários de edição.
- **`SignaturePreviewStage.tsx`**: Pré-visualização em tempo real (Light/Dark mode), alternância HTML/Visual e cópia para área de transferência via `ClipboardItem` (`text/html` e `text/plain`).

---

## 3. Contratos de Formato e Regras de Email-Safe HTML
- Todo o layout deve usar `<table>`, `<tr>`, `<td>` com atributos `cellpadding="0" cellspacing="0" border="0"`.
- Não utilizar `display: flex`, `display: grid`, nem pseudo-classes (`:hover`).
- Cores de texto e fontes devem ser aplicadas inline em `<td>` e `<span>`.
- Imagens devem conter `border: 0; display: block;` e atributos explícitos `width` e/ou `height`.
- Todos os links abrem em nova aba (`target="_blank" rel="noopener noreferrer"`).
