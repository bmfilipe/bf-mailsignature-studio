# MailSignatureStudio

<p align="center">
  <strong>Editor Web Local-First para Assinaturas de E-mail em HTML Compatível (Email-Safe)</strong><br />
  <em>Local-first web editor for email-safe HTML signatures</em>
</p>

<p align="center">
  <a href="#-português">Português</a> •
  <a href="#-english">English</a> •
  <a href="#-español">Español</a> •
  <a href="#-français">Français</a>
</p>

---

## 🇵🇹 Português

### Índice
1. [Sobre o Projeto](#sobre-o-projeto)
2. [Funcionalidades Principais](#funcionalidades-principais)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Guia de Utilização](#guia-de-utilização)
5. [Licença e Contribuições](#licença-e-contribuições)

---

### Sobre o Projeto
O **MailSignatureStudio** é uma aplicação web criada para desenhar, personalizar e exportar assinaturas de e-mail profissionais com compatibilidade assegurada para os principais clientes de correio eletrónico (Gmail, Microsoft Outlook, Apple Mail e Thunderbird).

Ao contrário de geradores convencionais que dependem de servidores ou serviços por subscrição, o MailSignatureStudio opera sob uma arquitetura **100% local-first**:
- Os teus dados não saem do teu navegador.
- O estado de edição é guardado automaticamente na memória local (`localStorage`).
- O código HTML compilado respeita as limitações dos motores de renderização de e-mail (incluindo motores baseados em Microsoft Word e WebKit antigo), utilizando tabelas rigorosas (`<table>`) e estilos puramente inline, sem dependência de flexbox ou CSS grid.

---

### Funcionalidades Principais
- **Múltiplos Modelos Visuais:** Alternância instantânea entre layouts clássicos, cartões compactos, formatos com crachá lateral e layouts com destaque promocional.
- **Campos de Informação Abrangentes:** Nome completo, pronomes, cargo, empresa, departamento, endereço físico, telefone, e-mail e página web.
- **Gestão de Imagens Seguras:** Suporte para fotografia de perfil/avatar (com ajuste de diâmetro e arredondamento) e logotipo institucional com altura parametrizável.
- **Redes Sociais Personalizáveis:** Adição, reordenação e ativação/desativação de atalhos para LinkedIn, GitHub, Instagram, X, YouTube, Website e WhatsApp.
- **Extensões de Comunicação (Add-ons):**
  - Botão de Chamada para Ação (Call to Action - CTA) com ligação configurável.
  - Banners promocionais com hiperligação.
  - Notas de confidencialidade e aviso legal (*disclaimer*).
- **Paleta e Tipografia Adaptáveis:** Seleção de cores primárias, secundárias e divisórias através de código hexadecimal, ajuste de tamanho de fonte e seleção de famílias tipográficas universais.
- **Pré-visualização em Tempo Real com Modo Claro / Escuro:** Simulação de como a assinatura surge em caixas de entrada com tema claro ou escuro.
- **Exportação Versátil:**
  - Cópia para a área de transferência em *Rich Text* (`text/html` e `text/plain`) para colagem direta nas definições do Gmail e Outlook.
  - Cópia do código HTML limpo compilado.
  - Download e upload de rascunhos completos em ficheiros `.json`.
- **Sanitização Rigorosa:** Escape automático de entidades HTML para prevenção de XSS e validação de esquemas de hiperligação seguros (`https:`, `http:`, `mailto:`, `tel:`), rejeitando protocolos perigosos.

---

### Instalação e Configuração

#### Pré-requisitos
- Node.js versão 20 ou superior.
- Gestor de pacotes npm (ou pnpm / yarn).
- Docker e Docker Compose (opcional, para execução isolada com servidor Nginx).

#### Passo 1: Obter o repositório e preparar o ambiente
```bash
git clone https://github.com/teu-usuario/bf-mailsignature-studio.git
cd bf-mailsignature-studio
cp .env.example .env
npm install
```

#### Passo 2: Executar em modo de desenvolvimento
```bash
npm run dev
```
Abre o teu navegador no endereço indicado no terminal (normalmente `http://localhost:5173`).

#### Passo 3: Verificação de testes e integridade
```bash
npm test          # Executa a suite de testes unitários com Vitest
npm run typecheck # Valida tipos TypeScript sem emitir ficheiros
npm run build     # Gera o pacote otimizado para produção na pasta dist/
```

#### Passo 4: Executar com Docker
```bash
docker compose up -d --build
```
A aplicação fica acessível através da porta `http://localhost:8080`.

---

### Guia de Utilização

1. **Selecionar Modelo:** No separador *Modelos*, escolhe a disposição que melhor representa a tua identidade profissional.
2. **Preencher Detalhes:** No separador *Detalhes*, introduz os teus contactos e dados organizacionais.
3. **Personalizar Imagens:** No separador *Imagens*, adiciona os endereços web do teu avatar e logotipo, ajustando os tamanhos pretendidos.
4. **Adicionar Ligações Sociais:** No separador *Redes Sociais*, ativa os teus perfis profissionais.
5. **Configurar Estilo:** No separador *Design*, define a tua cor institucional e a tipografia base.
6. **Copiar ou Descarregar:**
   - Clica em **Copiar Assinatura** para colar diretamente no teu cliente de e-mail favorito (Gmail: *Definições → Assinatura* / Outlook: *Definições → Conta → Assinaturas*).
   - Utiliza **Descarregar .JSON** caso queiras partilhar ou guardar o teu modelo para edições futuras.

---

### Licença e Contribuições
Este projeto é software livre e de código aberto disponibilizado sob a **Licença MIT**. Qualquer pessoa pode utilizar, inspecionar, modificar e partilhar melhorias de forma livre e gratuita. As contribuições da comunidade são bem-vindas através de *issues* e *pull requests*.

---

## 🇬🇧 English

### Table of Contents
1. [About the Project](#about-the-project)
2. [Key Features](#key-features)
3. [Installation and Setup](#installation-and-setup)
4. [User Guide](#user-guide)
5. [License and Open Collaboration](#license-and-open-collaboration)

---

### About the Project
**MailSignatureStudio** is a local-first web application designed to create, preview, and export high-compatibility email signatures for major email clients, including Gmail, Microsoft Outlook, Apple Mail, and Thunderbird.

Unlike online builders that require subscriptions or store your sensitive contacts in external databases, MailSignatureStudio is **completely private and local**:
- No contact information is ever transmitted to a remote server.
- Workspace state is saved locally in your browser (`localStorage`).
- Exported signatures strictly adhere to email rendering standards by utilizing clean nested HTML tables (`<table>`) and inline CSS styles, completely avoiding unsupported modern layout attributes like flexbox or CSS grid.

---

### Key Features
- **Curated Signature Templates:** Choose among classic vertical styles, compact badge cards, and promotional layouts.
- **Comprehensive Profile Fields:** Support for name, pronouns, title, company, department, phone, email, website, and physical address.
- **Secure Image Integration:** Configurable avatar photos (custom size and border radius) and brand logos with height controls.
- **Interactive Social Icons:** Enable, reorder, and configure direct links for LinkedIn, GitHub, Instagram, X, YouTube, Website, and WhatsApp.
- **Promotional Add-ons:**
  - Highlighting Call-to-Action (CTA) buttons.
  - Linked marketing campaign banners.
  - Legal disclaimer and confidentiality notices.
- **Appearance & Typography Customization:** Hex color pickers for brand tones and dividers, scalable font sizing, and cross-client system fonts.
- **Real-Time Light/Dark Preview:** Preview how the signature renders against dark mode and light mode backgrounds.
- **Versatile Clipboard and File Export:**
  - Rich text clipboard support (`text/html` + `text/plain`) for instant pasting into webmail editors.
  - Raw HTML viewing and copying.
  - Full `.json` configuration import, export, and file downloads.
- **Security-First Architecture:** Input sanitization escaping script tags and XSS payloads, coupled with a strict URL protocol allowlist (`https:`, `http:`, `mailto:`, `tel:`).

---

### Installation and Setup

#### Prerequisites
- Node.js 20 or higher.
- npm, pnpm, or yarn.
- Docker and Docker Compose (optional).

#### Step 1: Clone and install
```bash
git clone https://github.com/teu-usuario/bf-mailsignature-studio.git
cd bf-mailsignature-studio
cp .env.example .env
npm install
```

#### Step 2: Start development server
```bash
npm run dev
```

#### Step 3: Run automated test suite and type check
```bash
npm test
npm run typecheck
npm run build
```

#### Step 4: Docker deployment
```bash
docker compose up -d --build
```
Navigate to `http://localhost:8080`.

---

### User Guide
1. **Choose a Template:** Go to the *Templates* tab and select a layout.
2. **Enter Personal Details:** Fill in your professional contacts under *Details*.
3. **Embed Images:** Add public URLs for avatar and logo in the *Images* section.
4. **Connect Socials:** Activate and reorder links in the *Social* tab.
5. **Tune Styles:** Pick your brand color and typography in the *Design* tab.
6. **Export:** Click **Copy Signature** and paste directly into your email client's signature preferences.

---

### License and Open Collaboration
MailSignatureStudio is open-source software distributed under the **MIT License**. You are free to adapt, enhance, and deploy this project according to your needs. Community improvements and pull requests are welcomed.

---

## 🇪🇸 Español

### Índice
1. [Acerca del Proyecto](#acerca-del-proyecto)
2. [Características Principales](#características-principales)
3. [Instalación y Puesta en Marcha](#instalación-y-puesta-en-marcha)
4. [Guía de Uso](#guía-de-uso)
5. [Licencia y Contribución](#licencia-y-contribución)

---

### Acerca del Proyecto
**MailSignatureStudio** es un editor web enfocado en la privacidad local (*local-first*) para componer, previsualizar y exportar firmas de correo electrónico profesionales con total compatibilidad en Gmail, Microsoft Outlook, Apple Mail y otros clientes de escritorio y móviles.

Su arquitectura garantiza:
- Privacidad total: ningún dato personal se envía a servidores de terceros.
- Compatibilidad universal: generación estricta de tablas HTML (`<table>`) con estilos en línea, evitando el uso de flexbox o grid incompatibles con motores clásicos de correo.
- Persistencia inmediata: guardado automático en el navegador a través de `localStorage`.

---

### Características Principales
- **Diversas Plantillas:** Selección entre formatos clásicos, tarjetas compactas y diseños promocionales.
- **Campos Completos:** Nombre, pronombres, cargo, empresa, departamento, teléfono, correo, sitio web y dirección física.
- **Logotipos y Avatares:** Ajuste dimensional y redondeo de esquinas con enlaces a imágenes seguras.
- **Redes Profesionales:** Soporte para LinkedIn, GitHub, Instagram, X, YouTube, sitio web personal y WhatsApp.
- **Complementos Adicionales:** Botones de llamada a la acción (CTA), banners gráficos y cláusulas de confidencialidade o aviso legal.
- **Previsualización Modo Claro / Oscuro:** Verificación instantánea del contraste visual en ambos temas.
- **Copia Doble al Portapapeles:** Exportación simultánea en HTML enriquecido y texto plano para pegar de inmediato en Gmail u Outlook.
- **Seguridad Integrada:** Filtrado estricto contra inyecciones XSS y bloqueo de esquemas no autorizados como `javascript:`.

---

### Instalación y Puesta en Marcha

```bash
# 1. Clonar e instalar
git clone https://github.com/teu-usuario/bf-mailsignature-studio.git
cd bf-mailsignature-studio
cp .env.example .env
npm install

# 2. Iniciar en modo desarrollo
npm run dev

# 3. Validar pruebas y compilar
npm test
npm run typecheck
npm run build

# 4. Lanzar con Docker (opcional)
docker compose up -d --build
```

---

### Guía de Uso
1. Selecciona tu plantilla preferida en el menú lateral.
2. Rellena los datos de contacto y enlaces en los paneles correspondientes.
3. Configura los colores corporativos en la sección de diseño.
4. Haz clic en **Copiar Firma** y pégala en la configuración de firmas de tu cliente de correo.

---

### Licencia y Contribución
Proyecto de código abierto publicado bajo los términos de la **Licencia MIT**. Todo el mundo es libre de utilizar, auditar y proponer mejoras para enriquecer la herramienta.

---

## 🇫🇷 Français

### Table des Matières
1. [À Propos du Projet](#à-propos-du-projet)
2. [Fonctionnalités Principales](#fonctionnalités-principales)
3. [Installation et Configuration](#installation-et-configuration)
4. [Guide d'Utilisation](#guide-dutilisation)
5. [Licence et Contributions](#licence-et-contributions)

---

### À Propos du Projet
**MailSignatureStudio** est une application web conçue pour créer, visualiser et exporter des signatures de courriel élégantes et compatibles avec tous les logiciels de messagerie courants (Gmail, Outlook, Apple Mail, Thunderbird).

Conçu selon le principe **local-first** :
- Vos informations personnelles restent stockées dans votre navigateur (`localStorage`).
- Le code généré repose exclusivement sur des tableaux HTML (`<table>`) et du style CSS inline, garantissant un affichage fidèle même sur les moteurs de rendu les plus exigeants comme Microsoft Outlook.

---

### Fonctionnalités Principales
- **Modèles Élégants :** Choisissez entre une mise en page classique, une carte compacte ou une présentation promotionnelle.
- **Champs Personnalisés :** Nom, pronoms, fonction, entreprise, téléphone, e-mail, site internet et adresse.
- **Gestion des Images :** Intégration d'un avatar et du logo d'entreprise avec contrôle des dimensions et bordures.
- **Liens Réseaux Sociaux :** LinkedIn, GitHub, Instagram, X, YouTube, site web et WhatsApp.
- **Modules Complémentaires :** Bouton d'appel à l'action (CTA), bannière publicitaire cliquable et clause de confidentialité.
- **Prévisualisation Clair / Sombre :** Testez en un clic le rendu de votre signature sur fond blanc et sur fond sombre.
- **Copie Presse-Papiers Instantanée :** Copie en texte enrichi prête à être collée dans les réglages de votre messagerie.
- **Protection et Sécurité :** Échappement anti-XSS et filtrage rigoureux des protocoles d'URL.

---

### Installation et Configuration

```bash
# 1. Cloner et installer les paquets
git clone https://github.com/teu-usuario/bf-mailsignature-studio.git
cd bf-mailsignature-studio
cp .env.example .env
npm install

# 2. Lancer le serveur local
npm run dev

# 3. Lancer les tests et la compilation
npm test
npm run typecheck
npm run build

# 4. Lancer avec Docker
docker compose up -d --build
```

---

### Guide d'Utilisation
1. Choisissez un modèle dans l'onglet *Modèles*.
2. Complétez vos coordonnées professionnelles dans *Détails*.
3. Insérez les liens de vos images dans l'onglet *Images*.
4. Personnalisez les couleurs et polices dans *Design*.
5. Cliquez sur **Copier la signature** et collez-la directement dans votre application de messagerie.

---

### Licence et Contributions
Ce projet est un logiciel libre et open source distribué sous licence **MIT**. Toute contribution, suggestion ou amélioration est la bienvenue.
