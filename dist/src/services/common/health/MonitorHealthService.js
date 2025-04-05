"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorHealthService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const date_fns_1 = require("date-fns");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MonitorHealthService {
    async execute() {
        const health = {
            status: 'OK',
            uptime: process.uptime() + ' segundos',
            currentDate: new Date().toLocaleString(),
            memoryUsage: process.memoryUsage().heapUsed + ' bytes',
            version: process.version,
        };
        // Gera a data de hoje no formato YYYY-MM-DD para construir o caminho do arquivo
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
                logs = logData
                    .split('\n')
                    .filter((line) => line.trim() !== '')
                    .map((line) => {
                    try {
                        return JSON.parse(line);
                    }
                    catch (error) {
                        return { message: line };
                    }
                });
            }
            else {
                logs = [{ message: `Arquivo de log não encontrado em ${logFilePath}` }];
            }
        }
        catch (error) {
            logs = [{ message: `Erro ao ler logs: ${error.message}` }];
        }
        const start = (0, date_fns_1.startOfDay)(today);
        const end = (0, date_fns_1.endOfDay)(today);
        const users = await prismaClient_1.prismaClient.user.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
                deleted: false,
            },
        });
        const campaings = await prismaClient_1.prismaClient.campaing.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
                deleted: false,
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });
        return { health, logs, users, campaings };
    }
}
exports.MonitorHealthService = MonitorHealthService;
