import type {
  CompiledSignature,
  SignatureState,
  SocialLinkItem,
} from './signature.types';

const ALLOWED_LINK_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:'] as const;
const ALLOWED_IMAGE_PROTOCOLS = ['https:', 'http:'] as const;

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;

export function escapeHtml(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeUrl(
  rawUrl: string | undefined | null,
  allowedProtocols: readonly string[] = ALLOWED_LINK_PROTOCOLS
): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    if (!allowedProtocols.includes(protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function sanitizeHexColor(
  rawColor: string | undefined | null,
  fallback: string
): string {
  if (!rawColor) return fallback;
  const trimmed = rawColor.trim();
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : fallback;
}

export function clampPx(
  value: number | undefined | null,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(value)));
}

function formatSocialLabel(platform: SocialLinkItem['platform']): string {
  const labels: Record<SocialLinkItem['platform'], string> = {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    instagram: 'Instagram',
    x: 'X',
    youtube: 'YouTube',
    website: 'Website',
    whatsapp: 'WhatsApp',
  };
  return labels[platform];
}

function renderContactRows(
  state: SignatureState,
  textColor: string,
  mutedColor: string,
  primaryColor: string,
  fontFamily: string,
  smallSizePx: number,
  warnings: string[]
): string {
  const { email, phone, website, address } = state.details;
  const rows: string[] = [];

  const cleanEmail = email.trim();
  if (cleanEmail) {
    const mailHref = sanitizeUrl(`mailto:${cleanEmail}`, ['mailto:']);
    if (mailHref) {
      rows.push(
        `<tr><td style="padding:0 0 3px 0;font-family:${escapeHtml(fontFamily)};font-size:${smallSizePx}px;line-height:1.45;color:${textColor};">` +
          `<strong style="color:${mutedColor};font-weight:600;">Email:</strong> ` +
          `<a href="${escapeHtml(mailHref)}" target="_blank" rel="noopener noreferrer" style="color:${primaryColor};text-decoration:none;">${escapeHtml(cleanEmail)}</a>` +
          `</td></tr>`
      );
    } else {
      warnings.push('Email inválido ignorado na geração do link mailto.');
    }
  }

  const cleanPhone = phone?.trim();
  if (cleanPhone) {
    const telHref = sanitizeUrl(`tel:${cleanPhone.replace(/[^+\d]/g, '')}`, ['tel:']);
    const phoneDisplay = escapeHtml(cleanPhone);
    const phoneContent = telHref
      ? `<a href="${escapeHtml(telHref)}" target="_blank" rel="noopener noreferrer" style="color:${textColor};text-decoration:none;">${phoneDisplay}</a>`
      : phoneDisplay;

    rows.push(
      `<tr><td style="padding:0 0 3px 0;font-family:${escapeHtml(fontFamily)};font-size:${smallSizePx}px;line-height:1.45;color:${textColor};">` +
        `<strong style="color:${mutedColor};font-weight:600;">Tel:</strong> ${phoneContent}` +
        `</td></tr>`
    );
  }

  const cleanWebsite = website?.trim();
  if (cleanWebsite) {
    const normalizedWebsite = /^https?:\/\//i.test(cleanWebsite)
      ? cleanWebsite
      : `https://${cleanWebsite}`;
    const safeWebsite = sanitizeUrl(normalizedWebsite, ALLOWED_IMAGE_PROTOCOLS);
    if (safeWebsite) {
      rows.push(
        `<tr><td style="padding:0 0 3px 0;font-family:${escapeHtml(fontFamily)};font-size:${smallSizePx}px;line-height:1.45;color:${textColor};">` +
          `<strong style="color:${mutedColor};font-weight:600;">Web:</strong> ` +
          `<a href="${escapeHtml(safeWebsite)}" target="_blank" rel="noopener noreferrer" style="color:${primaryColor};text-decoration:none;">${escapeHtml(cleanWebsite)}</a>` +
          `</td></tr>`
      );
    } else {
      warnings.push('URL de website inválida ou insegura ignorada.');
    }
  }

  const cleanAddress = address?.trim();
  if (cleanAddress) {
    rows.push(
      `<tr><td style="padding:0 0 3px 0;font-family:${escapeHtml(fontFamily)};font-size:${smallSizePx}px;line-height:1.45;color:${mutedColor};">` +
        `${escapeHtml(cleanAddress)}` +
        `</td></tr>`
    );
  }

  if (rows.length === 0) return '';

  return (
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-top:6px;">` +
    rows.join('') +
    `</table>`
  );
}

function renderSocialRow(
  state: SignatureState,
  primaryColor: string,
  fontFamily: string,
  smallSizePx: number,
  warnings: string[]
): string {
  const validLinks: string[] = [];

  for (const item of state.socialLinks) {
    if (!item.enabled) continue;
    const safeUrl = sanitizeUrl(item.url, ALLOWED_IMAGE_PROTOCOLS);
    if (!safeUrl) {
      warnings.push(`Link social inválido ignorado (${item.platform}).`);
      continue;
    }
    const label = escapeHtml(formatSocialLabel(item.platform));
    validLinks.push(
      `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" ` +
        `style="display:inline-block;padding:3px 8px;margin-right:6px;margin-bottom:4px;` +
        `font-family:${escapeHtml(fontFamily)};font-size:${Math.max(11, smallSizePx - 1)}px;` +
        `font-weight:600;color:#ffffff;background-color:${primaryColor};` +
        `border-radius:4px;text-decoration:none;">${label}</a>`
    );
  }

  if (validLinks.length === 0) return '';

  return (
    `<tr><td colspan="2" style="padding-top:10px;font-family:${escapeHtml(fontFamily)};line-height:1.2;">` +
    validLinks.join('') +
    `</td></tr>`
  );
}

function renderAddonsSection(
  state: SignatureState,
  primaryColor: string,
  mutedColor: string,
  dividerColor: string,
  fontFamily: string,
  baseFontSizePx: number,
  warnings: string[]
): string {
  const parts: string[] = [];
  const { addons } = state;

  if (addons.showCta && addons.ctaLabel.trim()) {
    const safeCtaUrl = sanitizeUrl(addons.ctaUrl, ALLOWED_IMAGE_PROTOCOLS);
    if (safeCtaUrl) {
      parts.push(
        `<tr><td colspan="2" style="padding-top:10px;">` +
          `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>` +
          `<td style="background-color:${primaryColor};border-radius:5px;padding:7px 14px;">` +
          `<a href="${escapeHtml(safeCtaUrl)}" target="_blank" rel="noopener noreferrer" ` +
          `style="font-family:${escapeHtml(fontFamily)};font-size:${Math.max(12, baseFontSizePx - 1)}px;` +
          `font-weight:700;color:#ffffff;text-decoration:none;display:inline-block;">` +
          `${escapeHtml(addons.ctaLabel.trim())}</a>` +
          `</td></tr></table>` +
          `</td></tr>`
      );
    } else {
      warnings.push('CTA ocultado por conter URL inválida ou insegura.');
    }
  }

  if (addons.showBanner) {
    const safeBannerSrc = sanitizeUrl(addons.bannerImageUrl, ALLOWED_IMAGE_PROTOCOLS);
    const safeBannerHref = sanitizeUrl(addons.bannerLinkUrl, ALLOWED_IMAGE_PROTOCOLS);
    if (safeBannerSrc) {
      const alt = escapeHtml(addons.bannerAlt.trim() || 'Banner promocional');
      const imgTag =
        `<img src="${escapeHtml(safeBannerSrc)}" alt="${alt}" ` +
        `style="display:block;max-width:460px;width:100%;height:auto;border:0;border-radius:6px;" />`;
      const wrapped = safeBannerHref
        ? `<a href="${escapeHtml(safeBannerHref)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;border:0;">${imgTag}</a>`
        : imgTag;

      parts.push(`<tr><td colspan="2" style="padding-top:12px;">${wrapped}</td></tr>`);
    } else {
      warnings.push('Banner ocultado por conter URL de imagem inválida ou insegura.');
    }
  }

  if (addons.showDisclaimer && addons.disclaimerText.trim()) {
    parts.push(
      `<tr><td colspan="2" style="padding-top:10px;border-top:1px solid ${dividerColor};">` +
        `<p style="margin:6px 0 0 0;font-family:${escapeHtml(fontFamily)};font-size:11px;line-height:1.4;color:${mutedColor};">` +
        `${escapeHtml(addons.disclaimerText.trim())}` +
        `</p></td></tr>`
    );
  }

  return parts.join('');
}

function buildPlainText(state: SignatureState): string {
  const lines: string[] = [];
  const { fullName, pronouns, jobTitle, company, department, email, phone, website, address } =
    state.details;

  const headerParts = [fullName.trim(), pronouns?.trim() ? `(${pronouns.trim()})` : ''].filter(
    Boolean
  );
  if (headerParts.length > 0) lines.push(headerParts.join(' '));

  const roleCompany = [jobTitle.trim(), company.trim(), department?.trim()]
    .filter(Boolean)
    .join(' — ');
  if (roleCompany) lines.push(roleCompany);

  if (email.trim()) lines.push(`Email: ${email.trim()}`);
  if (phone?.trim()) lines.push(`Tel: ${phone.trim()}`);
  if (website?.trim()) lines.push(`Web: ${website.trim()}`);
  if (address?.trim()) lines.push(`Morada: ${address.trim()}`);

  for (const social of state.socialLinks) {
    if (social.enabled && social.url.trim()) {
      lines.push(`${formatSocialLabel(social.platform)}: ${social.url.trim()}`);
    }
  }

  if (state.addons.showCta && state.addons.ctaLabel.trim() && state.addons.ctaUrl.trim()) {
    lines.push(`${state.addons.ctaLabel.trim()}: ${state.addons.ctaUrl.trim()}`);
  }

  if (state.addons.showDisclaimer && state.addons.disclaimerText.trim()) {
    lines.push('---');
    lines.push(state.addons.disclaimerText.trim());
  }

  return lines.join('\n');
}

export function compileSignatureHtml(state: SignatureState): CompiledSignature {
  const warnings: string[] = [];

  const primaryColor = sanitizeHexColor(state.theme.primaryColor, '#2563eb');
  const textColor = sanitizeHexColor(state.theme.textColor, '#111827');
  const mutedColor = sanitizeHexColor(state.theme.mutedColor, '#6b7280');
  const dividerColor = sanitizeHexColor(state.theme.dividerColor, '#e5e7eb');
  const fontFamily = state.theme.fontFamily.trim() || 'Arial, Helvetica, sans-serif';
  const fontSizePx = clampPx(state.theme.fontSizePx, 12, 18, 14);
  const smallSizePx = Math.max(11, fontSizePx - 1);

  const avatarSizePx = clampPx(state.images.avatarSizePx, 40, 160, 76);
  const avatarRadiusPx = clampPx(state.images.avatarRadiusPx, 0, 80, 999);
  const safeAvatarUrl = state.images.showAvatar
    ? sanitizeUrl(state.images.avatarUrl, ALLOWED_IMAGE_PROTOCOLS)
    : null;

  if (state.images.showAvatar && !safeAvatarUrl) {
    warnings.push('Avatar ocultado por conter URL inválida ou insegura.');
  }

  const safeLogoUrl =
    state.images.showLogo && state.images.logoUrl
      ? sanitizeUrl(state.images.logoUrl, ALLOWED_IMAGE_PROTOCOLS)
      : null;

  if (state.images.showLogo && state.images.logoUrl && !safeLogoUrl) {
    warnings.push('Logotipo ocultado por conter URL inválida ou insegura.');
  }

  const logoHeightPx = clampPx(state.images.logoHeightPx, 16, 64, 24);

  const nameHtml = state.details.fullName.trim()
    ? `<span style="font-family:${escapeHtml(fontFamily)};font-size:${fontSizePx + 3}px;font-weight:700;color:${textColor};">${escapeHtml(state.details.fullName.trim())}</span>`
    : '';

  const pronounsHtml = state.details.pronouns?.trim()
    ? ` <span style="font-family:${escapeHtml(fontFamily)};font-size:${smallSizePx}px;font-weight:400;color:${mutedColor};">(${escapeHtml(state.details.pronouns.trim())})</span>`
    : '';

  const roleLineParts = [
    state.details.jobTitle.trim()
      ? `<strong style="color:${primaryColor};font-weight:600;">${escapeHtml(state.details.jobTitle.trim())}</strong>`
      : '',
    state.details.company.trim()
      ? `<span style="color:${textColor};font-weight:600;">${escapeHtml(state.details.company.trim())}</span>`
      : '',
    state.details.department?.trim()
      ? `<span style="color:${mutedColor};">${escapeHtml(state.details.department.trim())}</span>`
      : '',
  ].filter(Boolean);

  const roleLineHtml =
    roleLineParts.length > 0
      ? `<div style="margin-top:2px;font-family:${escapeHtml(fontFamily)};font-size:${smallSizePx}px;line-height:1.4;">${roleLineParts.join(` <span style="color:${mutedColor};">|</span> `)}</div>`
      : '';

  const logoHtml = safeLogoUrl
    ? `<div style="margin-top:6px;"><img src="${escapeHtml(safeLogoUrl)}" alt="${escapeHtml(state.images.logoAlt?.trim() || 'Logotipo')}" height="${logoHeightPx}" style="display:block;height:${logoHeightPx}px;width:auto;border:0;" /></div>`
    : '';

  const contactBlockHtml = renderContactRows(
    state,
    textColor,
    mutedColor,
    primaryColor,
    fontFamily,
    smallSizePx,
    warnings
  );

  const isCompact = state.templateId === 'compact-card';
  const leftCellHtml = safeAvatarUrl
    ? `<td valign="top" style="padding-right:14px;width:${avatarSizePx + 14}px;">` +
      `<img src="${escapeHtml(safeAvatarUrl)}" alt="${escapeHtml(state.images.avatarAlt.trim() || 'Fotografia de perfil')}" ` +
      `width="${avatarSizePx}" height="${avatarSizePx}" ` +
      `style="display:block;width:${avatarSizePx}px;height:${avatarSizePx}px;border-radius:${avatarRadiusPx}px;border:0;object-fit:cover;" />` +
      `</td>`
    : '';

  const borderLeftStyle =
    !safeAvatarUrl && state.templateId === 'split-badge'
      ? `border-left:3px solid ${primaryColor};padding-left:12px;`
      : safeAvatarUrl
        ? `border-left:${isCompact ? 'none' : `2px solid ${dividerColor}`};padding-left:${isCompact ? '0px' : '14px'};`
        : '';

  const rightCellHtml =
    `<td valign="top" style="font-family:${escapeHtml(fontFamily)};font-size:${fontSizePx}px;line-height:1.4;color:${textColor};${borderLeftStyle}">` +
    (nameHtml || pronounsHtml
      ? `<div style="line-height:1.25;">${nameHtml}${pronounsHtml}</div>`
      : '') +
    roleLineHtml +
    logoHtml +
    contactBlockHtml +
    `</td>`;

  const socialHtml = renderSocialRow(
    state,
    primaryColor,
    fontFamily,
    smallSizePx,
    warnings
  );

  const addonsHtml = renderAddonsSection(
    state,
    primaryColor,
    mutedColor,
    dividerColor,
    fontFamily,
    fontSizePx,
    warnings
  );

  const html =
    `<table cellpadding="0" cellspacing="0" border="0" role="presentation" ` +
    `style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;max-width:560px;font-family:${escapeHtml(fontFamily)};">` +
    `<tbody>` +
    `<tr>${leftCellHtml}${rightCellHtml}</tr>` +
    socialHtml +
    addonsHtml +
    `</tbody>` +
    `</table>`;

  return {
    html,
    plainText: buildPlainText(state),
    warnings,
  };
}
