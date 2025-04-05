# B4YOU Backend

Sistema backend do projeto **B4YOU**, desenvolvido em Node.js com Express, Prisma ORM e MongoDB. Este backend fornece APIs RESTful para gerenciamento de campanhas e usuários, além de um painel de monitoramento com dados em tempo real via WebSocket.

---

## 🧱 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **MongoDB**
- **WebSocket (nativo)**
- **EJS (para o monitoramento)**
- **Docker + Docker Compose**

---

## 📦 Instalação Local

> Pré-requisitos: Node.js, Docker e Docker Compose instalados.

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/b4you-backend.git
cd b4you-backend
```

2. **Crie um `.env` com a estrutura:**

```env
DATABASE_URL=mongodb://admin:admin123@mongo:27017/b4you?authSource=admin
JWT_SECRET=<sua_secret_key>
JWT_REFRESH_SECRET=<sua_refresh_secret>
ENV=DEV
ALLOWED_ORIGINS=http://localhost:3000
```

3. **Inicie com Docker:**

```bash
docker-compose up --build
```

- A API estará disponível em: [http://localhost:3333](http://localhost:3333)
- O painel de monitoramento estará em: [http://localhost:3001/monitor](http://localhost:3001/monitor)

---

## 📁 Estrutura de Pastas

```
.
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── prisma/
│   ├── monitor/
│   └── server.ts
├── docker-compose.yml
├── Dockerfile
├── README.md
└── .env
```

---

## 📡 Endpoints Principais

### 🔐 Autenticação (Users)

- `POST /users/register`
- `POST /users/login`
- `POST /users/refresh-token`

### 📢 Campanhas

- `GET /campaigns`
- `POST /campaigns`
- `PUT /campaigns/:id`
- `DELETE /campaigns/:id`

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

---

## 📄 Licença

MIT © [Seu Nome ou Organização]
