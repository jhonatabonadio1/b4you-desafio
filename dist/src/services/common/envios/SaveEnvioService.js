"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveEnvioService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class SaveEnvioService {
    async execute(data) {
        const { phoneNumber, imovelId, clientId, message, userId } = data;
        if (!phoneNumber || !imovelId || !clientId || !message || !userId) {
            throw new Error('Todos os campos são obrigatórios.');
        }
        // Salva o envio no banco de dados
        const envio = await prismaClient_1.prismaClient.envios.create({
            data: {
                phoneNumber,
                imovelId,
                v: 0,
                clientId,
                message,
                user: userId,
            },
        });
        return envio;
    }
}
exports.SaveEnvioService = SaveEnvioService;
