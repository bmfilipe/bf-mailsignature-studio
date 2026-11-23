import React from 'react';
import type { SignatureDetails } from '../../../domain/signature.types';

export interface DetailsTabProps {
  details: SignatureDetails;
  onChangeDetails: (patch: Partial<SignatureDetails>) => void;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  details,
  onChangeDetails,
}) => {
  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500';
  const labelClass = 'block text-xs font-medium text-slate-300';

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div>
        <label htmlFor="detail-fullname" className={labelClass}>
          Nome completo
        </label>
        <input
          id="detail-fullname"
          type="text"
          value={details.fullName}
          onChange={(e) => onChangeDetails({ fullName: e.target.value })}
          placeholder="Ex.: Bruno Filipe"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-pronouns" className={labelClass}>
          Pronomes (opcional)
        </label>
        <input
          id="detail-pronouns"
          type="text"
          value={details.pronouns ?? ''}
          onChange={(e) => onChangeDetails({ pronouns: e.target.value })}
          placeholder="Ex.: ele/dele"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-jobtitle" className={labelClass}>
          Cargo / Função
        </label>
        <input
          id="detail-jobtitle"
          type="text"
          value={details.jobTitle}
          onChange={(e) => onChangeDetails({ jobTitle: e.target.value })}
          placeholder="Ex.: Software Architect"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-company" className={labelClass}>
          Empresa / Marca
        </label>
        <input
          id="detail-company"
          type="text"
          value={details.company}
          onChange={(e) => onChangeDetails({ company: e.target.value })}
          placeholder="Ex.: MailSignatureStudio"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-department" className={labelClass}>
          Departamento (opcional)
        </label>
        <input
          id="detail-department"
          type="text"
          value={details.department ?? ''}
          onChange={(e) => onChangeDetails({ department: e.target.value })}
          placeholder="Ex.: Engenharia & Automação"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-email" className={labelClass}>
          E-mail
        </label>
        <input
          id="detail-email"
          type="email"
          value={details.email}
          onChange={(e) => onChangeDetails({ email: e.target.value })}
          placeholder="nome@dominio.pt"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-phone" className={labelClass}>
          Telefone / Telemóvel
        </label>
        <input
          id="detail-phone"
          type="tel"
          value={details.phone ?? ''}
          onChange={(e) => onChangeDetails({ phone: e.target.value })}
          placeholder="+351 910 000 000"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="detail-website" className={labelClass}>
          Website
        </label>
        <input
          id="detail-website"
          type="url"
          value={details.website ?? ''}
          onChange={(e) => onChangeDetails({ website: e.target.value })}
          placeholder="https://exemplo.pt"
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="detail-address" className={labelClass}>
          Morada / Localização
        </label>
        <input
          id="detail-address"
          type="text"
          value={details.address ?? ''}
          onChange={(e) => onChangeDetails({ address: e.target.value })}
          placeholder="Ex.: Faro, Portugal"
          className={inputClass}
        />
      </div>
    </div>
  );
};
