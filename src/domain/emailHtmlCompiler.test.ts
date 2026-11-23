import { describe, expect, it } from 'vitest';
import { compileSignatureHtml, escapeHtml, sanitizeUrl } from './emailHtmlCompiler';
import type { SignatureState } from './signature.types';

function createBaseState(overrides?: Partial<SignatureState>): SignatureState {
  return {
    id: 'sig-1',
    name: 'Assinatura Principal',
    templateId: 'classic',
    details: {
      fullName: 'Bruno Filipe',
      pronouns: 'ele/dele',
      jobTitle: 'Software Architect',
      company: 'MailSignatureStudio',
      department: 'Engenharia',
      email: 'bruno@exemplo.pt',
      phone: '+351 910 000 000',
      website: 'https://exemplo.pt',
      address: 'Faro, Portugal',
    },
    images: {
      avatarUrl: 'https://exemplo.pt/avatar.png',
      avatarAlt: 'Foto de Bruno Filipe',
      showAvatar: true,
      avatarSizePx: 80,
      avatarRadiusPx: 999,
      logoUrl: 'https://exemplo.pt/logo.png',
      logoAlt: 'Logo MailSignatureStudio',
      showLogo: true,
      logoHeightPx: 24,
    },
    socialLinks: [
      {
        id: 'soc-1',
        platform: 'linkedin',
        url: 'https://linkedin.com/in/exemplo',
        enabled: true,
      },
      {
        id: 'soc-2',
        platform: 'github',
        url: 'https://github.com/exemplo',
        enabled: false,
      },
    ],
    addons: {
      ctaLabel: 'Agendar reunião',
      ctaUrl: 'https://exemplo.pt/reuniao',
      showCta: true,
      bannerImageUrl: 'https://exemplo.pt/banner.png',
      bannerAlt: 'Banner de lançamento',
      bannerLinkUrl: 'https://exemplo.pt/novidades',
      showBanner: false,
      disclaimerText: 'Mensagem confidencial. Se não for o destinatário, elimine-a.',
      showDisclaimer: true,
    },
    theme: {
      primaryColor: '#2563eb',
      textColor: '#111827',
      mutedColor: '#6b7280',
      dividerColor: '#e5e7eb',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSizePx: 14,
    },
    ...overrides,
  };
}

describe('emailHtmlCompiler', () => {
  it('gera HTML baseado em tabelas sem flexbox ou grid', () => {
    const state = createBaseState();
    const result = compileSignatureHtml(state);

    expect(result.html).toContain('<table');
    expect(result.html).toContain('Bruno Filipe');
    expect(result.html).toContain('Software Architect');
    expect(result.html).not.toMatch(/display\s*:\s*flex/i);
    expect(result.html).not.toMatch(/display\s*:\s*grid/i);
    expect(result.warnings).toHaveLength(0);
  });

  it('escapa caracteres HTML para prevenir XSS nos campos de texto', () => {
    const state = createBaseState({
      details: {
        ...createBaseState().details,
        fullName: '<script>alert(1)</script>Bruno',
        company: 'Acme "Corp" & Co',
      },
    });

    const result = compileSignatureHtml(state);

    expect(result.html).not.toContain('<script>');
    expect(result.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;Bruno');
    expect(result.html).toContain('Acme &quot;Corp&quot; &amp; Co');
    expect(escapeHtml("a'b")).toBe('a&#39;b');
  });

  it('bloqueia esquemas perigosos como javascript: em links e imagens', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html;base64,PHNjcmlwdD4=')).toBeNull();
    expect(sanitizeUrl('https://exemplo.pt/ok')).toBe('https://exemplo.pt/ok');

    const state = createBaseState({
      images: {
        ...createBaseState().images,
        avatarUrl: 'javascript:evil()',
      },
      addons: {
        ...createBaseState().addons,
        ctaUrl: 'javascript:evil()',
      },
    });

    const result = compileSignatureHtml(state);

    expect(result.html).not.toContain('javascript:');
    expect(result.warnings.length).toBeGreaterThanOrEqual(2);
  });

  it('respeita estados desativados de redes sociais, CTA e aviso legal', () => {
    const state = createBaseState({
      socialLinks: [
        {
          id: 'soc-1',
          platform: 'linkedin',
          url: 'https://linkedin.com/in/exemplo',
          enabled: false,
        },
      ],
      addons: {
        ...createBaseState().addons,
        showCta: false,
        showDisclaimer: false,
      },
    });

    const result = compileSignatureHtml(state);

    expect(result.html).not.toContain('linkedin.com/in/exemplo');
    expect(result.html).not.toContain('Agendar reunião');
    expect(result.html).not.toContain('Mensagem confidencial');
    expect(result.plainText).not.toContain('Agendar reunião');
  });
});
