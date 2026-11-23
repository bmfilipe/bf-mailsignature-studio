import React, { useState } from 'react';
import type { SocialLinkItem, SocialPlatform } from '../../../domain/signature.types';

export interface SocialTabProps {
  socialLinks: SocialLinkItem[];
  onAddSocialLink: (platform?: SocialPlatform, url?: string) => void;
  onUpdateSocialLink: (id: string, patch: Partial<Omit<SocialLinkItem, 'id'>>) => void;
  onRemoveSocialLink: (id: string) => void;
  onMoveSocialLink: (fromIndex: number, toIndex: number) => void;
}

const PLATFORMS: Array<{ value: SocialPlatform; label: string }> = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'website', label: 'Website' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export const SocialTab: React.FC<SocialTabProps> = ({
  socialLinks,
  onAddSocialLink,
  onUpdateSocialLink,
  onRemoveSocialLink,
  onMoveSocialLink,
}) => {
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('linkedin');
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSocialLink(newPlatform, newUrl.trim() || 'https://');
    setNewUrl('');
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3"
      >
        <div className="min-w-[130px]">
          <label htmlFor="new-social-platform" className="block text-xs text-slate-400">
            Rede
          </label>
          <select
            id="new-social-platform"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-blue-500"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[180px] flex-1">
          <label htmlFor="new-social-url" className="block text-xs text-slate-400">
            URL do perfil
          </label>
          <input
            id="new-social-url"
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
        >
          Adicionar
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {socialLinks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-400">
            Sem redes sociais adicionadas.
          </p>
        ) : (
          socialLinks.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2.5"
            >
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) =>
                  onUpdateSocialLink(item.id, { enabled: e.target.checked })
                }
                aria-label={`Ativar ${item.platform}`}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600"
              />

              <select
                value={item.platform}
                onChange={(e) =>
                  onUpdateSocialLink(item.id, {
                    platform: e.target.value as SocialPlatform,
                  })
                }
                aria-label="Plataforma social"
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              <input
                type="url"
                value={item.url}
                onChange={(e) =>
                  onUpdateSocialLink(item.id, { url: e.target.value })
                }
                aria-label="URL social"
                className="min-w-[150px] flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100"
              />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMoveSocialLink(index, index - 1)}
                  aria-label="Mover para cima"
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === socialLinks.length - 1}
                  onClick={() => onMoveSocialLink(index, index + 1)}
                  aria-label="Mover para baixo"
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveSocialLink(item.id)}
                  aria-label="Remover rede social"
                  className="rounded border border-rose-500/30 bg-rose-950/40 px-2 py-1 text-xs text-rose-200 hover:bg-rose-900/50"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
