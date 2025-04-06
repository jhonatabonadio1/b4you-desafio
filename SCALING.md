
# SCALING.md

## 📦 Escalar aplicação

Este documento explica de forma simples como a aplicação pode crescer para atender mais usuários sem perder desempenho.

---

## 🧍‍♂️ 1. Mais usuários acessando

- A aplicação pode ser acessada por muitos clientes ao mesmo tempo.
- Para isso, usamos o **Heroku**, que permite aumentar o número de servidores (chamados de *dynos*) conforme a necessidade.

---

## 🧠 2. Separar tarefas

- Algumas tarefas são feitas em segundo plano (como envio de e-mails ou processamento de dados).
- Essas tarefas são colocadas em uma fila (BullMQ) e executadas separadamente por um sistema chamado **worker**.
- Isso evita que o sistema fique lento para o cliente.

---

## ⚡ 3. Melhorar a velocidade

- Usamos o **Redis** para guardar informações temporárias e rápidas, o que ajuda a acelerar o sistema.
- Isso evita ir ao banco de dados o tempo todo.

---

## 🗄️ 4. Crescimento do banco de dados

- O banco de dados usado é o **MongoDB**, que também pode crescer e se adaptar conforme aumenta a quantidade de dados.
- Ele pode ser configurado para funcionar com cópias de segurança e distribuição de carga.

---

## 🌐 5. Frontend (ReactJS)

- A parte visual da aplicação (ReactJS) pode ser hospedada em servidores rápidos e distribuídos pelo mundo.
- Isso garante que os clientes sempre tenham uma boa experiência, mesmo em lugares diferentes.

---

## ✅ Em resumo:

| O que fazer quando a aplicação crescer?      | Como resolver?                         |
|---------------------------------------------|----------------------------------------|
| Muitos acessos ao mesmo tempo               | Aumentar os dynos no Heroku            |
| Tarefas demoradas afetando o sistema        | Usar filas com BullMQ e Redis          |
| Sistema ficando lento                       | Usar cache com Redis                   |
| Muito dado no banco                         | Escalar o MongoDB                      |
| Clientes em lugares diferentes              | Usar hospedagem distribuída para o frontend |
