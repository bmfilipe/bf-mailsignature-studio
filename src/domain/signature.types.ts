export type SignatureTemplateId =
  | 'classic'
  | 'compact-card'
  | 'banner-promo'
  | 'split-badge';

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'x'
  | 'youtube'
  | 'website'
  | 'whatsapp';

export interface SignatureDetails {
  fullName: string;
  pronouns?: string;
  jobTitle: string;
  company: string;
  department?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface SignatureImages {
  avatarUrl: string;
  avatarAlt: string;
  showAvatar: boolean;
  avatarSizePx: number;
  avatarRadiusPx: number;
  logoUrl?: string;
  logoAlt?: string;
  showLogo: boolean;
  logoHeightPx: number;
}

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

export interface SignatureAddons {
  ctaLabel: string;
  ctaUrl: string;
  showCta: boolean;
  bannerImageUrl: string;
  bannerAlt: string;
  bannerLinkUrl: string;
  showBanner: boolean;
  disclaimerText: string;
  showDisclaimer: boolean;
}

export interface SignatureTheme {
  primaryColor: string;
  textColor: string;
  mutedColor: string;
  dividerColor: string;
  fontFamily: string;
  fontSizePx: number;
}

export interface SignatureState {
  id: string;
  name: string;
  templateId: SignatureTemplateId;
  details: SignatureDetails;
  images: SignatureImages;
  socialLinks: SocialLinkItem[];
  addons: SignatureAddons;
  theme: SignatureTheme;
}

export interface CompiledSignature {
  html: string;
  plainText: string;
  warnings: string[];
}
