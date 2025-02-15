# README – Modelagem de Dados

Este documento descreve como estruturar o banco de dados usando **Prisma** e **MongoDB** para um SaaS que cobra mensalidades via **Stripe** e faz upload de PDFs para AWS S3. Também há um **guia de implementação** em etapas para que você construa, primeiro, a lógica central do app e, depois, integre a Stripe.  

---

## Modelos Principais

### 1. User
- **Descrição**: Representa um usuário do sistema.
- **Campos**:
  - `email`, `password`, `name` – Informações de login e perfil.
  - `stripeCustomerId` – ID do cliente na Stripe (associado a este usuário).
  - `subscription` – Relação 1-1 com a tabela **Subscription** (assinatura atual).
  - `pdfs` – Relação 1-N com PDFs enviados.
  - `payments` – Relação 1-N com pagamentos realizados (caso queira relacionar cada fatura ao usuário).

### 2. Subscription
- **Descrição**: Armazena a assinatura do usuário em um determinado plano.
- **Campos**:
  - `userId` – Referência ao usuário assinante.
  - `stripeSubscriptionId` – ID da assinatura na Stripe (ex: `sub_xxx`).
  - `planId` – Referência ao **Plan** selecionado.
  - `status` – Ex.: `active`, `canceled`, `trial`, etc.
  - `startDate` e `endDate` – Controle de vigência da assinatura.

### 3. Plan
- **Descrição**: Define as características e limites de cada plano.
- **Campos**:
  - `name` – Nome do plano (Free, Start, Pro, Business).
  - `monthlyPrice` / `annualPrice` – Valores locais (opcional, pois a Stripe também guarda preços).
  - `monthlyPriceId` / `annualPriceId` – IDs dos preços na Stripe para cobrança.
  - `pdfLimit` e `storageLimit` – Limites de PDFs e armazenamento (em MB ou GB).

### 4. PDF
- **Descrição**: Cada PDF que o usuário faz upload.
- **Campos**:
  - `userId` – Dono do PDF.
  - `title`, `s3Key` – Metadados do arquivo (título e localização na AWS).
  - `sizeInBytes` – Tamanho do arquivo (para controle de armazenamento).

### 5. Payment (Opcional, para histórico de faturas/pagamentos)
- **Descrição**: Se você desejar armazenar localmente o histórico de pagamentos (invoices/charges) vindos da Stripe, utilize este modelo.
- **Campos**:
  - `stripeInvoiceId` – ID da invoice/charge na Stripe (ex: `in_xxx` ou `ch_xxx`).
  - `amount` – Valor da cobrança (normalmente em centavos).
  - `currency` – Código da moeda (ex: `BRL`, `USD`).
  - `status` – Ex.: `paid`, `open`, `void`, `uncollectible`.
  - `userId` – Referência ao usuário que pagou.
  - *Possível referência a `subscriptionId` também, se quiser vincular pagamento à assinatura.*

---



## SUGESTÃO FUNCIONALIDADES EXTRAS: MAPA DE CALOR DO PDF, ANALYTICS DE CADA PÁGINA DO PDF. 

# Criar o mapa de calor
- Com as coordenadas agregadas, você usa ferramentas de visualização (HTML5 Canvas, D3.js, Python + matplotlib, etc.) para gerar um heatmap que mostre onde houve mais concentração de cliques ou de tempo de visualização.

# Criar analytics
- Cada PDF terá seus analytics (por página e geral)

# Criar site a partir do PDF
- Poderá criar um site identico com HTML, CSS e Javascript ao PDF.
