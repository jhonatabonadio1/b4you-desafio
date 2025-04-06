
# Monitoramento e Logs

Este documento descreve as práticas e ferramentas sugeridas para o monitoramento e logging da aplicação Node.js.

---

## 📝 Ferramentas de Logs

1. **Winston (Node.js)**
   - Biblioteca robusta para logging, permitindo múltiplos *transports* (console, arquivos, serviços externos como LogDNA, Papertrail, etc.).
   - Ideal para armazenar e organizar logs de erros e eventos importantes do sistema.

2. **Morgan (Node.js)**
   - Middleware para logging de requisições HTTP.
   - Útil para monitorar tráfego, tempos de resposta e identificar anomalias nas chamadas da API.

---

## 📊 Monitoramento de Métricas

1. **Prometheus**
   - Ferramenta de coleta de métricas em tempo real.
   - Permite criar alertas baseados em uso de CPU, memória, quantidade de requisições, filas, entre outros.
   - Integra bem com Node.js via bibliotecas como `prom-client`.

2. **Grafana**
   - Plataforma para criar dashboards com as métricas do Prometheus (ou outras fontes).
   - Visualização intuitiva e personalizável com alertas visuais e históricos de desempenho.

---

## 📈 Business Intelligence

1. **MongoDB Charts**
   - Ferramenta de visualização oficial da MongoDB para dashboards e gráficos interativos.
   - Permite criar gráficos diretamente a partir dos dados da aplicação, sem precisar mover os dados para outro sistema.
   - Ideal para dashboards gerenciais e análises de negócio (ex: vendas, uso de funcionalidades, retenção de usuários).
   - Pode ser incorporado via iframe em painéis administrativos internos.
