import { useCallback, useEffect, useState } from 'react';
import type {
  SignatureAddons,
  SignatureDetails,
  SignatureImages,
  SignatureState,
  SignatureTemplateId,
  SignatureTheme,
  SocialLinkItem,
  SocialPlatform,
} from '../domain/signature.types';

const STORAGE_KEY = 'mailsignature_studio_state_v1';

export const DEFAULT_SIGNATURE_STATE: SignatureState = {
  id: 'default-signature',
  name: 'Assinatura Principal',
  templateId: 'classic',
  details: {
    fullName: 'Bruno Filipe',
    pronouns: '',
    jobTitle: 'Software Architect & Automation Specialist',
    company: 'MailSignatureStudio',
    department: '',
    email: 'contacto@exemplo.pt',
    phone: '+351 910 000 000',
    website: 'https://exemplo.pt',
    address: 'Faro, Portugal',
  },
  images: {
    avatarUrl: '',
    avatarAlt: 'Fotografia de perfil',
    showAvatar: false,
    avatarSizePx: 80,
    avatarRadiusPx: 999,
    logoUrl: '',
    logoAlt: 'Logotipo da empresa',
    showLogo: false,
    logoHeightPx: 24,
  },
  socialLinks: [
    {
      id: 'social-linkedin',
      platform: 'linkedin',
      url: 'https://www.linkedin.com',
      enabled: true,
    },
    {
      id: 'social-github',
      platform: 'github',
      url: 'https://github.com',
      enabled: true,
    },
  ],
  addons: {
    ctaLabel: 'Falar comigo',
    ctaUrl: 'https://exemplo.pt/contacto',
    showCta: false,
    bannerImageUrl: '',
    bannerAlt: 'Banner informativo',
    bannerLinkUrl: 'https://exemplo.pt',
    showBanner: false,
    disclaimerText:
      'Esta mensagem e eventuais anexos destinam-se apenas ao destinatário indicado e podem conter informação confidencial.',
    showDisclaimer: false,
  },
  theme: {
    primaryColor: '#2563eb',
    textColor: '#111827',
    mutedColor: '#6b7280',
    dividerColor: '#e5e7eb',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSizePx: 14,
  },
};

function createUniqueId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeSignatureState(
  input: unknown,
  fallback: SignatureState = DEFAULT_SIGNATURE_STATE
): SignatureState | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Partial<SignatureState>;

  const validTemplates: SignatureTemplateId[] = [
    'classic',
    'compact-card',
    'banner-promo',
    'split-badge',
  ];

  const validPlatforms: SocialPlatform[] = [
    'linkedin',
    'github',
    'instagram',
    'x',
    'youtube',
    'website',
    'whatsapp',
  ];

  const rawSocial: unknown[] = Array.isArray(raw.socialLinks) ? raw.socialLinks : fallback.socialLinks;
  const normalizedSocial: SocialLinkItem[] = rawSocial
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const idVal = item.id;
      const platformVal = item.platform;
      const urlVal = item.url;
      const enabledVal = item.enabled;

      return {
        id:
          typeof idVal === 'string' && idVal.trim()
            ? idVal.trim()
            : `social-${index}-${createUniqueId('item')}`,
        platform:
          typeof platformVal === 'string' && validPlatforms.includes(platformVal as SocialPlatform)
            ? (platformVal as SocialPlatform)
            : 'website',
        url: typeof urlVal === 'string' ? urlVal : '',
        enabled: typeof enabledVal === 'boolean' ? enabledVal : true,
      };
    });

  return {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id : fallback.id,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name : fallback.name,
    templateId:
      raw.templateId && validTemplates.includes(raw.templateId)
        ? raw.templateId
        : fallback.templateId,
    details: {
      ...fallback.details,
      ...(raw.details && typeof raw.details === 'object' ? raw.details : {}),
    },
    images: {
      ...fallback.images,
      ...(raw.images && typeof raw.images === 'object' ? raw.images : {}),
    },
    socialLinks: normalizedSocial,
    addons: {
      ...fallback.addons,
      ...(raw.addons && typeof raw.addons === 'object' ? raw.addons : {}),
    },
    theme: {
      ...fallback.theme,
      ...(raw.theme && typeof raw.theme === 'object' ? raw.theme : {}),
    },
  };
}

function loadInitialState(): SignatureState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_SIGNATURE_STATE;
  }

  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return DEFAULT_SIGNATURE_STATE;
    const parsed = JSON.parse(serialized) as unknown;
    return normalizeSignatureState(parsed) ?? DEFAULT_SIGNATURE_STATE;
  } catch {
    return DEFAULT_SIGNATURE_STATE;
  }
}

export interface UseSignatureStoreReturn {
  signature: SignatureState;
  lastError: string | null;
  clearError: () => void;
  setTemplate: (templateId: SignatureTemplateId) => void;
  setSignatureName: (name: string) => void;
  updateDetails: (patch: Partial<SignatureDetails>) => void;
  updateImages: (patch: Partial<SignatureImages>) => void;
  updateAddons: (patch: Partial<SignatureAddons>) => void;
  updateTheme: (patch: Partial<SignatureTheme>) => void;
  addSocialLink: (platform?: SocialPlatform, url?: string) => void;
  updateSocialLink: (id: string, patch: Partial<Omit<SocialLinkItem, 'id'>>) => void;
  removeSocialLink: (id: string) => void;
  moveSocialLink: (fromIndex: number, toIndex: number) => void;
  exportJson: (pretty?: boolean) => string;
  downloadJsonFile: (filename?: string) => void;
  importJson: (rawJson: string) => boolean;
  resetToDefault: () => void;
}

export function useSignatureStore(
  initialOverride?: SignatureState
): UseSignatureStoreReturn {
  const [signature, setSignature] = useState<SignatureState>(() =>
    initialOverride
      ? (normalizeSignatureState(initialOverride) ?? DEFAULT_SIGNATURE_STATE)
      : loadInitialState()
  );
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(signature));
    } catch {
      setLastError('Não foi possível guardar automaticamente no localStorage.');
    }
  }, [signature]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const setTemplate = useCallback((templateId: SignatureTemplateId) => {
    setSignature((prev) => ({
      ...prev,
      templateId,
    }));
  }, []);

  const setSignatureName = useCallback((name: string) => {
    setSignature((prev) => ({
      ...prev,
      name,
    }));
  }, []);

  const updateDetails = useCallback((patch: Partial<SignatureDetails>) => {
    setSignature((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        ...patch,
      },
    }));
  }, []);

  const updateImages = useCallback((patch: Partial<SignatureImages>) => {
    setSignature((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        ...patch,
      },
    }));
  }, []);

  const updateAddons = useCallback((patch: Partial<SignatureAddons>) => {
    setSignature((prev) => ({
      ...prev,
      addons: {
        ...prev.addons,
        ...patch,
      },
    }));
  }, []);

  const updateTheme = useCallback((patch: Partial<SignatureTheme>) => {
    setSignature((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...patch,
      },
    }));
  }, []);

  const addSocialLink = useCallback(
    (platform: SocialPlatform = 'website', url = 'https://') => {
      const newItem: SocialLinkItem = {
        id: createUniqueId('social'),
        platform,
        url,
        enabled: true,
      };
      setSignature((prev) => ({
        ...prev,
        socialLinks: [...prev.socialLinks, newItem],
      }));
    },
    []
  );

  const updateSocialLink = useCallback(
    (id: string, patch: Partial<Omit<SocialLinkItem, 'id'>>) => {
      setSignature((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      }));
    },
    []
  );

  const removeSocialLink = useCallback((id: string) => {
    setSignature((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((item) => item.id !== id),
    }));
  }, []);

  const moveSocialLink = useCallback((fromIndex: number, toIndex: number) => {
    setSignature((prev) => {
      const items = [...prev.socialLinks];
      if (
        fromIndex < 0 ||
        fromIndex >= items.length ||
        toIndex < 0 ||
        toIndex >= items.length ||
        fromIndex === toIndex
      ) {
        return prev;
      }
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return {
        ...prev,
        socialLinks: items,
      };
    });
  }, []);

  const exportJson = useCallback(
    (pretty = true): string => JSON.stringify(signature, null, pretty ? 2 : 0),
    [signature]
  );

  const downloadJsonFile = useCallback(
    (filename = 'assinatura-email.json') => {
      if (typeof document === 'undefined') return;
      const jsonString = JSON.stringify(signature, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [signature]
  );

  const importJson = useCallback((rawJson: string): boolean => {
    try {
      const parsed = JSON.parse(rawJson) as unknown;
      const normalized = normalizeSignatureState(parsed);
      if (!normalized) {
        setLastError('O JSON importado não tem uma estrutura de assinatura válida.');
        return false;
      }
      setSignature(normalized);
      setLastError(null);
      return true;
    } catch {
      setLastError('JSON inválido: não foi possível interpretar o conteúdo.');
      return false;
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setSignature(DEFAULT_SIGNATURE_STATE);
    setLastError(null);
  }, []);

  return {
    signature,
    lastError,
    clearError,
    setTemplate,
    setSignatureName,
    updateDetails,
    updateImages,
    updateAddons,
    updateTheme,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
    moveSocialLink,
    exportJson,
    downloadJsonFile,
    importJson,
    resetToDefault,
  };
}
