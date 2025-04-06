# B4YOU - Desafio Técnico

A arquitetura da aplicação B4you foi projetada para ser escalável, segura e modular. O frontend é desenvolvido em ReactJS, acessando um backend construído com Node.js e Express, que expõe as rotas da API. As tarefas demoradas, como envio de e-mails ou processamento de dados, são tratadas por workers usando BullMQ, que se comunica com o Redis para gerenciamento de filas.

O banco de dados principal é o MongoDB, acessado através do Prisma ORM, garantindo consultas mais seguras e estruturadas. A aplicação está hospedada na Heroku, que permite escalabilidade automática por meio de dynos separados para o servidor web e os workers.

Essa estrutura permite que a aplicação suporte alto volume de usuários, mantendo desempenho e organização, além de facilitar o monitoramento, segurança e manutenção de cada parte do sistema.

![Logo da empresa](./diagrama_arquitetura_b4you.jpg)

## 🧱 Tecnologias Utilizadas

- **Heroku**
- **Node.js**
- **Express.js**
- **Prisma ORM**
- **MongoDB**
- **Bull MQ**
- **Redis**

## 🔐 Documentação de Segurança, Escalabilidade e Monitoramento

- [SECURITY.md](./SECURITY.md)
- [SCALING.md](./SCALING.md)
- [MONITORING.md](./MONITORING.md)
