# HEATMAPS - BACKEND RULES
✅ Bloqueia registros duplicados para a mesma sessionId dentro de 1 minuto.
✅ Alternância de registros (1 sim, 1 não) baseada no docId, mas controlada pela sessionId.
✅ Cada sessão (sessionId) armazena seu próprio estado collectedHeatmap.
✅ Se uma sessão já existir nos últimos 5 minutos, retorna a mesma.
✅ Se passou mais de 5 minutos, cria e retorna uma nova sessão.

# HEATMAPS - FRONTEND RULES

✅ 1. Criar uma sessão no backend ao entrar na tela e armazenar o sessionId no useState

O sessionId é salvo no useState, garantindo que seja utilizado corretamente na requisição dos heatmaps.
Se o usuário recarregar a página, uma nova sessão será criada.
✅ 2. Capturar eventos de movimento do mouse e armazenar os heatmaps no localStorage

Os heatmaps são salvos no localStorage para reduzir o uso de memória no useState.
O estado do React (useState) não será mais utilizado para armazenar os heatmaps.
A cada nova interação, os heatmaps são adicionados ao localStorage.
✅ 3. Enviar os heatmaps automaticamente a cada 1 minuto

Os heatmaps são lidos do localStorage e enviados automaticamente para a API.
Após o envio, os heatmaps são removidos do localStorage.
✅ 4. Se o usuário ficar inativo por mais de 2 minutos, os heatmaps devem ser apagados

Caso o usuário não interaja por 2 minutos, os heatmaps são apagados do localStorage e o tracking reinicia.
✅ 5. Sempre que entrar na tela, os heatmaps do localStorage devem ser apagados

Quando a tela for carregada, qualquer heatmap armazenado anteriormente será resetado.


🛑 ERRO: SÓ CAPTURA DE COMEÇAR PELA PÁGINA 1, DEVE CAPTURAR EM QUALQUER PÁGINA, E ENVIAR O LOTE TMB.


# Próxima funcionalidade (cobrança):
- Validação de usuário antes de criar a conta
- Configurar cobrança

# Próxima funcionalidade (regras):
- Regras de funcionalidades de acordo com o plano do usuário
- Regras blacklist

# Final
- Subir servidor
- Subir frontend
- Subir ferramentas auxiliares

# Testes
- Antes de subir, testar todas as funcionalidades em diferentes dispositivos
- Após subir, fazer igual antes de divulgar a plataforma.
- Precisa definir canais de suporte ao cliente (ticket, livechat e etc.)

# Próxima funcionalidade (usar redis no futuro):
- Links identificados
- Clique em links
- Opção de marcar "Link de conversão" 
- Mensurar conversão de "links de conversão" com "visualizações por página" e visualizações gerais
- Exportar relatório (período) (pdf bonito e enviar por e-email (redis))

# Próximos passos (heatmaps, usar redis no futuro)

- informar ao front quando deve coletar o heatmap daquela sessão. (somente usuários "Business")
- Ignorar pontos próximos demais da mesma sessão (até 6px de diferença)
- Opção de resetar Heatmaps (cliente)
- Opção de exportar Heatmaps (imagem) (cliente)
- Registrar Cliques e Scroll (analisar ainda)