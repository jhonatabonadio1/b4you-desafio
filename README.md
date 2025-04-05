# B4YOU Backend

Sistema backend do projeto **B4YOU**, desenvolvido em Node.js com Express, Prisma ORM e MongoDB. Este backend fornece APIs RESTful para gerenciamento de campanhas e usuários, além de um painel de monitoramento com dados em tempo real via WebSocket.

---

## 🧱 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **MongoDB**
- **WebSocket (nativo)**
- **EJS**
- **Docker**

---

## 📦 Instalação Local

> Pré-requisitos: Node.js, Docker e Docker Compose instalados.

1. **Clone o repositório:**

```bash
git clone https://github.com/jhonatabonadio1/b4you-desafio.git
cd b4you-backend
```

1. **Inicie com Docker:**

```bash
docker-compose up --build
```

- A API estará disponível em: [http://localhost:3333](http://localhost:3333)
- O painel de monitoramento estará em: [http://localhost:3333/monitor](http://localhost:3333/monitor)

---
---

## 📡 Endpoints Principais

### 🔐 Autenticação (Users)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/token/refresh`

### 📢 Campanhas

- `GET /campaing`
- `POST /campaing`
- `PUT /campaing/:id`
- `DELETE /campaing/:id`

### 🩺 Monitoramento

- `GET /health` — Status da API (heartbeat)
- `GET /monitor` — Painel com informações em tempo real (memória, uptime, DB...)

---

## 🔄 Prisma

Se precisar gerar o Prisma Client manualmente:

```bash
yarn prisma generate
```

---

## 🔐 Documentação de Segurança, Escalabilidade e Monitoramento

- [SECURITY.md](./SECURITY.md)
- [SCALING.md](./SCALING.md)
- [MONITORING.md](./MONITORING.md)
