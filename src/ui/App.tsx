import React, { useRef, useState } from 'react';
import { useSignatureStore } from '../store/useSignatureStore';
import { EditorSidebar } from './components/EditorSidebar';
import { SignaturePreviewStage } from './preview/SignaturePreviewStage';

export const App: React.FC = () => {
  const store = useSignatureStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonModalMode, setJsonModalMode] = useState<'import' | 'export'>('import');
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonStatusMessage, setJsonStatusMessage] = useState<string | null>(null);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  const openExportModal = () => {
    setJsonModalMode('export');
    setJsonDraft(store.exportJson(true));
    setJsonStatusMessage(null);
    setIsJsonModalOpen(true);
  };

  const openImportModal = () => {
    setJsonModalMode('import');
    setJsonDraft('');
    setJsonStatusMessage(null);
    setIsJsonModalOpen(true);
  };

  const handleConfirmImport = () => {
    const ok = store.importJson(jsonDraft);
    if (ok) {
      setJsonStatusMessage('JSON importado com sucesso.');
      setIsJsonModalOpen(false);
    } else {
      setJsonStatusMessage('JSON inválido ou incompatível. Verifica o formato antes de importar.');
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const ok = store.importJson(text);
      if (ok) {
        setJsonStatusMessage(null);
        setIsJsonModalOpen(false);
      } else {
        setJsonStatusMessage(`O ficheiro "${file.name}" não contém um JSON de assinatura válido.`);
      }
    } catch {
      setJsonStatusMessage('Não foi possível ler o ficheiro selecionado.');
    } finally {
      e.target.value = '';
    }
  };

  const handleCopyJsonDraft = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonDraft);
        setJsonStatusMessage('JSON copiado para a área de transferência.');
      }
    } catch {
      setJsonStatusMessage('Seleciona o texto manualmente e copia (Ctrl+C / Cmd+C).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/90 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <h1 className="text-lg font-bold tracking-tight text-white">
                MailSignatureStudio
              </h1>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                Local-First · Email-Safe HTML
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Cria, testa em Light/Dark e exporta assinaturas de e-mail baseadas em tabelas HTML.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => store.downloadJsonFile(`${store.signature.id || 'assinatura'}.json`)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700"
            >
              Descarregar .JSON
            </button>
            <button
              type="button"
              onClick={() => setIsInstallGuideOpen(true)}
              className="rounded-lg border border-blue-500/40 bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-900/50"
            >
              Guia Gmail / Outlook
            </button>
          </div>
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileSelected}
        className="hidden"
      />

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-6">
          <EditorSidebar
            store={store}
            onExportJsonClick={openExportModal}
            onImportJsonClick={openImportModal}
          />
        </div>

        <div className="lg:col-span-6 lg:sticky lg:top-6">
          <SignaturePreviewStage
            signature={store.signature}
            onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          />
        </div>
      </main>

      {isJsonModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={jsonModalMode === 'export' ? 'Exportar JSON' : 'Importar JSON'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {jsonModalMode === 'export'
                  ? 'Exportar configuração (JSON)'
                  : 'Importar configuração (JSON)'}
              </h2>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {jsonModalMode === 'import' && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
                  <span className="text-slate-400">
                    Carrega um ficheiro <code className="text-slate-200">.json</code> ou cola o payload abaixo:
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-semibold text-slate-100 hover:bg-slate-700"
                  >
                    Escolher ficheiro .json
                  </button>
                </div>
              )}

              <textarea
                rows={12}
                value={jsonDraft}
                readOnly={jsonModalMode === 'export'}
                onChange={(e) => {
                  setJsonDraft(e.target.value);
                  if (jsonStatusMessage) setJsonStatusMessage(null);
                }}
                placeholder={
                  jsonModalMode === 'import'
                    ? '{ "id": "...", "name": "...", "templateId": "classic", ... }'
                    : undefined
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-blue-500"
              />

              {jsonStatusMessage && (
                <p
                  role="status"
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-200"
                >
                  {jsonStatusMessage}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                {jsonModalMode === 'export' ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        store.downloadJsonFile(`${store.signature.id || 'assinatura'}.json`)
                      }
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
                    >
                      Descarregar ficheiro
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyJsonDraft}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Copiar JSON
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmImport}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Aplicar JSON
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isInstallGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Guia de instalação no Gmail e Outlook"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Como instalar a assinatura no e-mail
              </h2>
              <button
                type="button"
                onClick={() => setIsInstallGuideOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <h3 className="font-semibold text-white">Gmail (Web)</h3>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-slate-400">
                  <li>Clica em <strong className="text-slate-200">Copiar Assinatura</strong> para copiar em Rich Text.</li>
                  <li>Abre <strong className="text-slate-200">Definições → Ver todas as definições → Geral → Assinatura</strong>.</li>
                  <li>Cola (<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">Ctrl+V</kbd> / <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">Cmd+V</kbd>) na caixa de assinatura e guarda no fundo da página.</li>
                </ol>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <h3 className="font-semibold text-white">Outlook (Web / Novo Outlook)</h3>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-slate-400">
                  <li>Usa <strong className="text-slate-200">Copiar Assinatura</strong> no modo Visual.</li>
                  <li>Vai a <strong className="text-slate-200">Definições → Conta → Assinaturas</strong>.</li>
                  <li>Cola diretamente no editor de assinatura e associa às contas pretendidas.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
