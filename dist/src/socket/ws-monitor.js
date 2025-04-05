"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ws-monitor.ts
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const logger_1 = require("../config/logger");
// Cria um servidor HTTP básico para compartilhar a mesma porta com o WebSocket
const server = http_1.default.createServer();
// Cria o servidor WebSocket utilizando o módulo "ws"
const wss = new ws_1.default.Server({ server });
// Função para ler os logs do arquivo do dia atual
async function readLogs() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const logFolder = path_1.default.resolve(`logs/${yyyy}-${mm}-${dd}`);
    const logFilePath = path_1.default.join(logFolder, 'app.log');
    let logs = [];
    try {
        if (fs_1.default.existsSync(logFilePath)) {
            const logData = await fs_1.default.promises.readFile(logFilePath, 'utf8');
            logs = logData.split('\n').filter((line) => line.trim() !== '');
        }
        else {
            logs.push(`Arquivo de log não encontrado em ${logFilePath}`);
        }
    }
    catch (error) {
        logs.push(`Erro ao ler logs: ${error.message}`);
    }
    return logs;
}
// Quando um cliente se conecta via WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente conectado via WebSocket para monitoramento.');
    const prismaClient = new client_1.PrismaClient();
    // Função que coleta e envia os dados de monitoramento
    const sendStatus = async () => {
        // Verifica a conexão com o banco de dados realizando uma query simples (por exemplo, consultando um usuário)
        let dbStatus = 'OK';
        try {
            await prismaClient.user.findMany();
        }
        catch (error) {
            logger_1.logger.error(error.message);
            dbStatus = 'DOWN';
        }
        // Leitura dos logs do dia
        const logs = await readLogs();
        // Conta transações de sucesso e erro a partir dos logs
        let successCount = 0;
        let errorCount = 0;
        for (const logLine of logs) {
            try {
                const logObj = JSON.parse(logLine);
                if (logObj.level) {
                    const level = logObj.level.toLowerCase();
                    if (level === 'success')
                        successCount++;
                    if (level === 'error')
                        errorCount++;
                }
            }
            catch (err) {
                // Se não for um JSON válido, ignora a linha
            }
        }
        // Monta os dados de health
        const health = {
            // Uptime em minutos (convertendo de segundos)
            uptime: (process.uptime() / 60).toFixed(2) + ' minutos',
            // Uso de memória convertido para MB
            memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
            currentDate: new Date().toLocaleString(),
            dbConnection: dbStatus,
            transactions: {
                success: successCount,
                errors: errorCount,
            },
        };
        // Monta o payload para envio
        const payload = {
            type: 'monitor-update',
            data: {
                health,
                logs,
            },
        };
        // Envia os dados para o cliente
        ws.send(JSON.stringify(payload));
    };
    // Envia a atualização inicial imediatamente
    sendStatus();
    // Envia atualizações a cada 5 segundos
    const intervalId = setInterval(sendStatus, 5000);
    // Limpa o intervalo caso o cliente desconecte
    ws.on('close', () => {
        console.log('Cliente desconectado do monitoramento.');
        clearInterval(intervalId);
    });
    // Trata erros na conexão
    ws.on('error', (error) => {
        console.error('Erro no WebSocket:', error);
    });
});
// Define a porta para o servidor WebSocket
const PORT_WS = 3001;
server.listen(PORT_WS, () => {
    console.log(`Servidor WebSocket de monitoramento rodando na porta ${PORT_WS}`);
});
