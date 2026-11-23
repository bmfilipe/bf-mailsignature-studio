import React from 'react';
import type { SignatureTemplateId } from '../../../domain/signature.types';

export interface TemplatesTabProps {
  selectedTemplate: SignatureTemplateId;
  onSelectTemplate: (templateId: SignatureTemplateId) => void;
}

const TEMPLATE_OPTIONS: Array<{
  id: SignatureTemplateId;
  title: string;
  description: string;
}> = [
  {
    id: 'classic',
    title: 'Clássico Horizontal',
    description: 'Coluna visual à esquerda, dados e contactos à direita com divisória.',
  },
  {
    id: 'compact-card',
    title: 'Cartão Compacto',
    description: 'Layout mais denso e direto, ideal para mensagens frequentes.',
  },
  {
    id: 'split-badge',
    title: 'Destaque Lateral',
    description: 'Borda vertical colorida quando o avatar está oculto ou em destaque.',
  },
  {
    id: 'banner-promo',
    title: 'Foco em CTA / Banner',
    description: 'Estrutura pensada para acompanhar botões de ação ou banners promocionais.',
  },
];

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-400">
        Escolhe a base estrutural da assinatura. Todos os templates são compilados em tabelas HTML compatíveis com clientes de e-mail.
      </p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {TEMPLATE_OPTIONS.map((tpl) => {
          const active = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              aria-pressed={active}
              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                active
                  ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className="text-sm font-semibold text-white">{tpl.title}</span>
              <span className="mt-1 text-xs leading-relaxed text-slate-400">
                {tpl.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
