import React from 'react';
import type { SignatureImages } from '../../../domain/signature.types';

export interface ImagesTabProps {
  images: SignatureImages;
  onChangeImages: (patch: Partial<SignatureImages>) => void;
}

export const ImagesTab: React.FC<ImagesTabProps> = ({
  images,
  onChangeImages,
}) => {
  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500';

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Fotografia / Avatar
          </span>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={images.showAvatar}
              onChange={(e) => onChangeImages({ showAvatar: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            Mostrar avatar
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="img-avatar-url" className="block text-xs text-slate-400">
              URL da imagem (HTTPS público)
            </label>
            <input
              id="img-avatar-url"
              type="url"
              value={images.avatarUrl}
              onChange={(e) => onChangeImages({ avatarUrl: e.target.value })}
              placeholder="https://exemplo.pt/avatar.jpg"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="img-avatar-alt" className="block text-xs text-slate-400">
              Texto alternativo (alt)
            </label>
            <input
              id="img-avatar-alt"
              type="text"
              value={images.avatarAlt}
              onChange={(e) => onChangeImages({ avatarAlt: e.target.value })}
              placeholder="Fotografia de perfil"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="img-avatar-size" className="block text-xs text-slate-400">
              Tamanho ({images.avatarSizePx}px)
            </label>
            <input
              id="img-avatar-size"
              type="range"
              min={40}
              max={160}
              value={images.avatarSizePx}
              onChange={(e) =>
                onChangeImages({ avatarSizePx: Number(e.target.value) })
              }
              className="mt-2.5 w-full accent-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="img-avatar-radius" className="block text-xs text-slate-400">
              Arredondamento ({images.avatarRadiusPx}px)
            </label>
            <input
              id="img-avatar-radius"
              type="range"
              min={0}
              max={80}
              value={images.avatarRadiusPx}
              onChange={(e) =>
                onChangeImages({ avatarRadiusPx: Number(e.target.value) })
              }
              className="mt-2 w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Logotipo da empresa
          </span>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={images.showLogo}
              onChange={(e) => onChangeImages({ showLogo: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            Mostrar logotipo
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="img-logo-url" className="block text-xs text-slate-400">
              URL do logotipo (HTTPS)
            </label>
            <input
              id="img-logo-url"
              type="url"
              value={images.logoUrl ?? ''}
              onChange={(e) => onChangeImages({ logoUrl: e.target.value })}
              placeholder="https://exemplo.pt/logo.png"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="img-logo-height" className="block text-xs text-slate-400">
              Altura ({images.logoHeightPx}px)
            </label>
            <input
              id="img-logo-height"
              type="range"
              min={16}
              max={64}
              value={images.logoHeightPx}
              onChange={(e) =>
                onChangeImages({ logoHeightPx: Number(e.target.value) })
              }
              className="mt-2.5 w-full accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
