#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EVIDENCE_BASE="${REA_EVIDENCE_DIR:-$PROJECT_ROOT/docs/rea-evidence}"
RAW_DIR="$EVIDENCE_BASE/raw"
TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"

usage() {
  cat <<'EOF'
Uso:
  ./scripts/rea-inspect.sh <url-alvo> [etiqueta-opcional]

Exemplos:
  ./scripts/rea-inspect.sh "https://mysignature.io/editor?utm_source=test" editor-ui
  ./scripts/rea-inspect.sh "https://mysignature.io/editor"
EOF
}

sanitize_url() {
  local raw_url="$1"
  if command -v python3 >/dev/null 2>&1; then
    python3 -c '
import sys
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse

raw = sys.argv[1].strip()
parsed = urlparse(raw)
if not parsed.scheme or not parsed.netloc:
    sys.exit(1)

tracking_prefixes = ("utm_",)
tracking_exact = {
    "fbclid", "gclid", "dclid", "msclkid", "mc_cid", "mc_eid",
    "_ga", "_gl", "ref", "source"
}

filtered_params = [
    (k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=True)
    if k.lower() not in tracking_exact and not any(k.lower().startswith(p) for p in tracking_prefixes)
]

cleaned = urlunparse((
    parsed.scheme.lower(),
    parsed.netloc.lower(),
    parsed.path or "/",
    parsed.params,
    urlencode(filtered_params),
    ""
))
print(cleaned)
' "$raw_url"
  else
    printf '%s\n' "${raw_url%%\?*}"
  fi
}

resolve_rea_runner() {
  if [[ -n "${REA_CMD:-}" ]]; then
    printf '%s\n' "$REA_CMD"
    return 0
  fi
  if command -v rea >/dev/null 2>&1; then
    printf '%s\n' "rea"
    return 0
  fi
  if command -v npx >/dev/null 2>&1; then
    printf '%s\n' "npx -y rea-agents@latest"
    return 0
  fi
  return 1
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || $# -lt 1 ]]; then
  usage
  exit 0
fi

RAW_URL="$1"
LABEL="${2:-inspection}"
SAFE_LABEL="$(printf '%s' "$LABEL" | tr -cs 'A-Za-z0-9_-' '-' | sed 's/^-//;s/-$//')"
[[ -z "$SAFE_LABEL" ]] && SAFE_LABEL="inspection"

CLEAN_URL="$(sanitize_url "$RAW_URL")" || {
  echo "Erro: URL inválido ou mal formado: $RAW_URL" >&2
  exit 1
}

SESSION_DIR="$EVIDENCE_BASE/${TIMESTAMP}_${SAFE_LABEL}"
mkdir -p "$SESSION_DIR" "$RAW_DIR"

META_FILE="$SESSION_DIR/session-meta.json"
LOG_FILE="$SESSION_DIR/rea-output.log"
NOTES_FILE="$SESSION_DIR/findings-template.md"

REA_RUNNER="$(resolve_rea_runner || true)"
REA_AVAILABLE="false"
[[ -n "$REA_RUNNER" ]] && REA_AVAILABLE="true"

cat >"$META_FILE" <<EOF
{
  "timestamp_utc": "$TIMESTAMP",
  "label": "$SAFE_LABEL",
  "raw_url": "$RAW_URL",
  "canonical_url": "$CLEAN_URL",
  "rea_available": $REA_AVAILABLE,
  "rea_runner": "${REA_RUNNER:-none}",
  "evidence_dir": "$SESSION_DIR"
}
EOF

cat >"$NOTES_FILE" <<EOF
# Evidências de Inspeção REA — MailSignatureStudio

- **Data/Hora (UTC):** $TIMESTAMP
- **Etiqueta:** $SAFE_LABEL
- **URL Canónico:** $CLEAN_URL
- **Runner REA:** ${REA_RUNNER:-não detetado}

## 1. Fluxos de UI e Estados Observados
- Abas / secções de edição identificadas:
- Campos de entrada e controlos visuais relevantes:
- Estados de pré-visualização (Light/Dark, desktop/mobile, HTML):

## 2. Padrões Técnicos Relevantes para o MailSignatureStudio
- Estrutura de layout do preview vs. output final de e-mail:
- Mecanismos de cópia / exportação:
- Pontos de atenção (compatibilidade de clientes de e-mail, sanitização, acessibilidade):

## 3. Notas de Conformidade
- Sem cópia de marcas, logotipos ou ativos proprietários de terceiros; apenas análise funcional e estrutural para recriação própria.
EOF

echo "Sessão criada em: $SESSION_DIR"
echo "URL canónico:     $CLEAN_URL"

if [[ "$REA_AVAILABLE" == "true" ]]; then
  echo "A executar runner REA ($REA_RUNNER)..."
  set +e
  if [[ "$REA_RUNNER" == "rea" ]]; then
    rea inspect "$CLEAN_URL" --output "$RAW_DIR/${TIMESTAMP}_${SAFE_LABEL}" >"$LOG_FILE" 2>&1
    EXIT_CODE=$?
  else
    $REA_RUNNER --help >"$LOG_FILE" 2>&1
    EXIT_CODE=$?
  fi
  set -e
  echo "Log guardado em: $LOG_FILE (código de saída: $EXIT_CODE)"
else
  echo "Aviso: nem 'rea' nem 'npx' foram encontrados no PATH." >&2
  exit 1
fi
