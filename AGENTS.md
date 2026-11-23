# AGENTS.md — Regras Globais do Projeto MailSignatureStudio

Este ficheiro define as diretrizes operacionais para agentes de IA e programadores neste projeto, aplicando o perfil **REA + Recriação Equivalente** e ligando o ciclo de trabalho aos playbooks em `.bfskills/`.

## 1. Ligação aos Playbooks (`.bfskills/`)
Consulta e segue o playbook correspondente à etapa em curso antes de alterar código ou arquitetura:
- **Requisitos e Escopo:** `.bfskills/BF-QUESTIONARIO-REQUISITOS.md`
- **Arquitetura e Contratos:** `.bfskills/BF-ESPECIFICACAO-TECNICA.md`
- **Implementação de Código:** `.bfskills/BF-IMPLEMENTAR-CODIGO.md`
- **Testes e Validação:** `.bfskills/BF-DESENVOLVIMENTO-TESTING.md`
- **Revisão de Qualidade e Segurança:** `.bfskills/BF-REVISAO-CODIGO.md`
- **Auditoria Estrutural:** `.bfskills/BF-AUDITORIA-ARQUITETURA.md`

## 2. Perfil REA + Recriação Equivalente
- **Inspeção Estruturada (`morluto/rea`):** Usa o REA para analisar fluxos de UI, estados de editor e padrões de interação de referência, registando evidências técnicas objetivas.
- **Zero Clonagem Ilícita:** Não copies logotipos, marcas, textos protegidos ou ativos proprietários de sites de terceiros. Constrói identidade, schemas, estilos e testes originais com paridade funcional.

## 3. Regras Técnicas Obrigatórias do Domínio
- **Separação de Camadas:** Mantém o modelo de dados (`SignatureState`) e o compilador HTML (`emailHtmlCompiler`) isolados dos componentes visuais do editor.
- **HTML Email-Safe:** O HTML final da assinatura deve usar tabelas (`<table>`) e estilos inline compatíveis com clientes de e-mail; evita `flexbox`, `grid` ou dependências de scripts no e-mail renderizado.
- **Segurança em Inputs e Links:** Escapa sempre strings do utilizador para prevenir XSS e valida esquemas de URL (`https:`, `http:`, `mailto:`, `tel:`), rejeitando esquemas perigosos como `javascript:`.
- **Testes:** Qualquer alteração ao compilador de HTML ou à sanitização de URLs/inputs exige atualização ou criação de testes unitários correspondentes.
