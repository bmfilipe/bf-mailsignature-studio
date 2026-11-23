import React from 'react';
import type { SignatureAddons, SignatureTheme } from '../../../domain/signature.types';

export interface DesignTabProps {
  theme: SignatureTheme;
  addons: SignatureAddons;
  onChangeTheme: (patch: Partial<SignatureTheme>) => void;
  onChangeAddons: (patch: Partial<SignatureAddons>) => void;
}

const FONT_OPTIONS = [
  'Arial, Helvetica, sans-serif',
  'Georgia, Times New Roman, serif',
  'Verdana, Geneva, sans-serif',
  'Trebuchet MS, Helvetica, sans-serif',
];

export const DesignTab: React.FC<DesignTabProps> = ({
  theme,
  addons,
  onChangeTheme,
  onChangeAddons,
}) => {
  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500';

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Estilo & Tipografia Email-Safe
        </span>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="flex flex-col text-xs text-slate-400">
            Cor principal
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => onChangeTheme({ primaryColor: e.target.value })}
              className="mt-1 h-9 w-full cursor-pointer rounded border border-slate-700 bg-slate-900 p-0.5"
            />
          </label>

          <label className="flex flex-col text-xs text-slate-400">
            Texto base
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => onChangeTheme({ textColor: e.target.value })}
              className="mt-1 h-9 w-full cursor-pointer rounded border border-slate-700 bg-slate-900 p-0.5"
            />
          </label>

          <label className="flex flex-col text-xs text-slate-400">
            Texto secundário
            <input
              type="color"
              value={theme.mutedColor}
              onChange={(e) => onChangeTheme({ mutedColor: e.target.value })}
              className="mt-1 h-9 w-full cursor-pointer rounded border border-slate-700 bg-slate-900 p-0.5"
            />
          </label>

          <label className="flex flex-col text-xs text-slate-400">
            Divisória
            <input
              type="color"
              value={theme.dividerColor}
              onChange={(e) => onChangeTheme({ dividerColor: e.target.value })}
              className="mt-1 h-9 w-full cursor-pointer rounded border border-slate-700 bg-slate-900 p-0.5"
            />
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="design-font-family" className="block text-xs text-slate-400">
              Família tipográfica
            </label>
            <select
              id="design-font-family"
              value={theme.fontFamily}
              onChange={(e) => onChangeTheme({ fontFamily: e.target.value })}
              className={inputClass}
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="design-font-size" className="block text-xs text-slate-400">
              Tamanho base ({theme.fontSizePx}px)
            </label>
            <input
              id="design-font-size"
              type="range"
              min={12}
              max={18}
              value={theme.fontSizePx}
              onChange={(e) =>
                onChangeTheme({ fontSizePx: Number(e.target.value) })
              }
              className="mt-2.5 w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Complementos (CTA, Banner e Aviso Legal)
        </span>

        <div className="mt-3 border-b border-slate-800/80 pb-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-200">
            <input
              type="checkbox"
              checked={addons.showCta}
              onChange={(e) => onChangeAddons({ showCta: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600"
            />
            Botão de ação (CTA)
          </label>

          {addons.showCta && (
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={addons.ctaLabel}
                onChange={(e) => onChangeAddons({ ctaLabel: e.target.value })}
                placeholder="Texto do botão"
                className={inputClass}
              />
              <input
                type="url"
                value={addons.ctaUrl}
                onChange={(e) => onChangeAddons({ ctaUrl: e.target.value })}
                placeholder="https://exemplo.pt/acao"
                className={inputClass}
              />
            </div>
          )}
        </div>

        <div className="mt-3 border-b border-slate-800/80 pb-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-200">
            <input
              type="checkbox"
              checked={addons.showBanner}
              onChange={(e) => onChangeAddons({ showBanner: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600"
            />
            Banner promocional / informativo
          </label>

          {addons.showBanner && (
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="url"
                value={addons.bannerImageUrl}
                onChange={(e) =>
                  onChangeAddons({ bannerImageUrl: e.target.value })
                }
                placeholder="URL da imagem do banner (HTTPS)"
                className={inputClass}
              />
              <input
                type="url"
                value={addons.bannerLinkUrl}
                onChange={(e) =>
                  onChangeAddons({ bannerLinkUrl: e.target.value })
                }
                placeholder="URL de destino ao clicar (opcional)"
                className={inputClass}
              />
            </div>
          )}
        </div>

        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-200">
            <input
              type="checkbox"
              checked={addons.showDisclaimer}
              onChange={(e) =>
                onChangeAddons({ showDisclaimer: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600"
            />
            Aviso legal / confidencialidade
          </label>

          {addons.showDisclaimer && (
            <textarea
              rows={3}
              value={addons.disclaimerText}
              onChange={(e) =>
                onChangeAddons({ disclaimerText: e.target.value })
              }
              placeholder="Texto de confidencialidade ou aviso legal..."
              className={inputClass}
            />
          )}
        </div>
      </div>
    </div>
  );
};
