import React, { useMemo, useRef, useState } from 'react';
import { compileSignatureHtml } from '../../domain/emailHtmlCompiler';
import type { SignatureState } from '../../domain/signature.types';

export interface SignaturePreviewStageProps {
  signature: SignatureState;
  onOpenInstallGuide?: () => void;
}

type PreviewSurfaceMode = 'light' | 'dark';
type ViewMode = 'visual' | 'html';
type ViewportWidth = 'desktop' | 'mobile';
type CopyFeedback =
  | { status: 'idle' }
  | { status: 'copied-rich'; message: string }
  | { status: 'copied-html'; message: string }
  | { status: 'error'; message: string };

export const SignaturePreviewStage: React.FC<SignaturePreviewStageProps> = ({
  signature,
  onOpenInstallGuide,
}) => {
  const [surfaceMode, setSurfaceMode] = useState<PreviewSurfaceMode>('light');
  const [viewMode, setViewMode] = useState<ViewMode>('visual');
  const [viewportWidth, setViewportWidth] = useState<ViewportWidth>('desktop');
  const [feedback, setFeedback] = useState<CopyFeedback>({ status: 'idle' });

  const richContainerRef = useRef<HTMLDivElement | null>(null);

  const compiled = useMemo(() => compileSignatureHtml(signature), [signature]);

  const setTemporaryFeedback = (next: CopyFeedback) => {
    setFeedback(next);
    window.setTimeout(() => {
      setFeedback((current) => (current === next ? { status: 'idle' } : current));
    }, 3000);
  };

  const fallbackCopyDomSelection = (): boolean => {
    const node = richContainerRef.current;
    if (!node) return false;

    const selection = window.getSelection();
    if (!selection) return false;

    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }

    selection.removeAllRanges();
    return copied;
  };

  const handleCopyRichSignature = async () => {
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof ClipboardItem !== 'undefined'
      ) {
        const htmlBlob = new Blob([compiled.html], { type: 'text/html' });
        const textBlob = new Blob([compiled.plainText], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
          }),
        ]);
        setTemporaryFeedback({
          status: 'copied-rich',
          message: 'Assinatura copiada (Rich Text). Pronta a colar no cliente de e-mail.',
        });
        return;
      }
    } catch {
      // Fallback para seleção DOM
    }

    const ok = fallbackCopyDomSelection();
    if (ok) {
      setTemporaryFeedback({
        status: 'copied-rich',
        message: 'Assinatura copiada via seleção direta.',
      });
    } else {
      setTemporaryFeedback({
        status: 'error',
        message: 'Não foi possível copiar automaticamente. Usa "Copiar HTML".',
      });
    }
  };

  const handleCopyRawHtml = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(compiled.html);
        setTemporaryFeedback({
          status: 'copied-html',
          message: 'Código HTML copiado para a área de transferência.',
        });
        return;
      }
    } catch {
      // Fallback textarea
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = compiled.html;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (copied) {
        setTemporaryFeedback({
          status: 'copied-html',
          message: 'Código HTML copiado.',
        });
      } else {
        setTemporaryFeedback({
          status: 'error',
          message: 'Falha ao copiar o código HTML.',
        });
      }
    } catch {
      setTemporaryFeedback({
        status: 'error',
        message: 'Falha ao copiar o código HTML.',
      });
    }
  };

  return (
    <section
      aria-label="Pré-visualização e exportação da assinatura"
      className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-slate-100 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Modo de visualização"
            className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1"
          >
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              aria-pressed={viewMode === 'visual'}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'visual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setViewMode('html')}
              aria-pressed={viewMode === 'html'}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'html'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              HTML
            </button>
          </div>

          <div
            role="group"
            aria-label="Fundo de pré-visualização"
            className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1"
          >
            <button
              type="button"
              onClick={() => setSurfaceMode('light')}
              aria-pressed={surfaceMode === 'light'}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                surfaceMode === 'light'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setSurfaceMode('dark')}
              aria-pressed={surfaceMode === 'dark'}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                surfaceMode === 'dark'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>

          {viewMode === 'visual' && (
            <div
              role="group"
              aria-label="Largura de teste"
              className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1"
            >
              <button
                type="button"
                onClick={() => setViewportWidth('desktop')}
                aria-pressed={viewportWidth === 'desktop'}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  viewportWidth === 'desktop'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewportWidth('mobile')}
                aria-pressed={viewportWidth === 'mobile'}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  viewportWidth === 'mobile'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mobile
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyRawHtml}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700"
          >
            Copiar HTML
          </button>
          <button
            type="button"
            onClick={handleCopyRichSignature}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            Copiar Assinatura
          </button>
        </div>
      </div>

      {feedback.status !== 'idle' && (
        <div
          role="status"
          className={`rounded-lg border px-3.5 py-2 text-xs font-medium ${
            feedback.status === 'error'
              ? 'border-rose-500/40 bg-rose-950/50 text-rose-200'
              : 'border-emerald-500/40 bg-emerald-950/50 text-emerald-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {compiled.warnings.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-amber-500/40 bg-amber-950/40 px-3.5 py-2.5 text-xs text-amber-200"
        >
          <p className="font-semibold">Avisos de validação ({compiled.warnings.length}):</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {compiled.warnings.map((warning, idx) => (
              <li key={`${idx}-${warning}`}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {viewMode === 'visual' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Simulação de cliente de e-mail ({surfaceMode === 'light' ? 'Fundo Claro' : 'Fundo Escuro'})
            </span>
            <span>{viewportWidth === 'desktop' ? 'Vista ampla' : '360px'}</span>
          </div>

          <div
            className={`mx-auto overflow-x-auto rounded-xl border p-6 transition-colors ${
              viewportWidth === 'mobile' ? 'max-w-[360px]' : 'w-full'
            } ${
              surfaceMode === 'light'
                ? 'border-slate-200 bg-white text-slate-900'
                : 'border-slate-700 bg-[#141619] text-slate-100'
            }`}
          >
            <div
              ref={richContainerRef}
              dangerouslySetInnerHTML={{ __html: compiled.html }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>HTML Email-Safe compilado (tabelas + estilos inline)</span>
            <span>{compiled.html.length} caracteres</span>
          </div>
          <pre className="max-h-[420px] overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs leading-relaxed text-slate-200">
            <code>{compiled.html}</code>
          </pre>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
        <span>Dica: em clientes de e-mail, usa &ldquo;Copiar Assinatura&rdquo; para colar formatado.</span>
        {onOpenInstallGuide && (
          <button
            type="button"
            onClick={onOpenInstallGuide}
            className="font-semibold text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline"
          >
            Como colar no Gmail / Outlook
          </button>
        )}
      </div>
    </section>
  );
};
