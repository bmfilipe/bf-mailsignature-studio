import React, { useState } from 'react';
import type { SignatureTemplateId } from '../../domain/signature.types';
import type { UseSignatureStoreReturn } from '../../store/useSignatureStore';
import { DesignTab } from './tabs/DesignTab';
import { DetailsTab } from './tabs/DetailsTab';
import { ImagesTab } from './tabs/ImagesTab';
import { SocialTab } from './tabs/SocialTab';
import { TemplatesTab } from './tabs/TemplatesTab';

export type EditorTabId = 'templates' | 'details' | 'images' | 'social' | 'design';

export interface EditorSidebarProps {
  store: UseSignatureStoreReturn;
  onExportJsonClick?: () => void;
  onImportJsonClick?: () => void;
}

const TABS: Array<{ id: EditorTabId; label: string }> = [
  { id: 'templates', label: 'Templates' },
  { id: 'details', label: 'Detalhes' },
  { id: 'images', label: 'Imagens' },
  { id: 'social', label: 'Social' },
  { id: 'design', label: 'Design' },
];

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  store,
  onExportJsonClick,
  onImportJsonClick,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTabId>('details');
  const { signature, lastError, clearError } = store;

  return (
    <aside
      aria-label="Editor da assinatura de e-mail"
      className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-slate-100 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="signature-profile-name"
            className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Perfil da assinatura
          </label>
          <input
            id="signature-profile-name"
            type="text"
            value={signature.name}
            onChange={(e) => store.setSignatureName(e.target.value)}
            placeholder="Nome da assinatura"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 pt-4 sm:pt-0">
          {onImportJsonClick && (
            <button
              type="button"
              onClick={onImportJsonClick}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
            >
              Importar JSON
            </button>
          )}
          {onExportJsonClick && (
            <button
              type="button"
              onClick={onExportJsonClick}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
            >
              Exportar JSON
            </button>
          )}
          <button
            type="button"
            onClick={store.resetToDefault}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-rose-500/40 hover:text-rose-300"
          >
            Repor
          </button>
        </div>
      </div>

      {lastError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-xs text-rose-200"
        >
          <span>{lastError}</span>
          <button
            type="button"
            onClick={clearError}
            className="font-semibold underline hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      <nav
        aria-label="Secções do editor"
        className="grid grid-cols-5 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="min-h-[380px]">
        {activeTab === 'templates' && (
          <TemplatesTab
            selectedTemplate={signature.templateId}
            onSelectTemplate={(tpl: SignatureTemplateId) => store.setTemplate(tpl)}
          />
        )}
        {activeTab === 'details' && (
          <DetailsTab
            details={signature.details}
            onChangeDetails={store.updateDetails}
          />
        )}
        {activeTab === 'images' && (
          <ImagesTab
            images={signature.images}
            onChangeImages={store.updateImages}
          />
        )}
        {activeTab === 'social' && (
          <SocialTab
            socialLinks={signature.socialLinks}
            onAddSocialLink={store.addSocialLink}
            onUpdateSocialLink={store.updateSocialLink}
            onRemoveSocialLink={store.removeSocialLink}
            onMoveSocialLink={store.moveSocialLink}
          />
        )}
        {activeTab === 'design' && (
          <DesignTab
            theme={signature.theme}
            addons={signature.addons}
            onChangeTheme={store.updateTheme}
            onChangeAddons={store.updateAddons}
          />
        )}
      </div>
    </aside>
  );
};
