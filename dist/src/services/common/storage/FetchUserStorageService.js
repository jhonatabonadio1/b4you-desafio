"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserStorageService = void 0;
const DefaultApplicationRules_1 = require("../../../config/DefaultApplicationRules");
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserStorageService {
    async execute(userId) {
        if (!userId) {
            throw new Error('O ID do usuário é obrigatório.');
        }
        let limiteStorage = DefaultApplicationRules_1.defaultApplicationRules.storage.limit;
        const buscaInscricaoUsuário = await prismaClient_1.prismaClient.subscription.findFirst({
            where: {
                active: true,
                userId,
                status: 'active',
                endDate: {
                    gte: new Date(),
                },
            },
            select: {
                plan: true,
            },
        });
        if (buscaInscricaoUsuário) {
            limiteStorage = buscaInscricaoUsuário.plan.limit;
        }
        // 🔹 Busca os arquivos do usuário e soma os tamanhos
        const userFiles = await prismaClient_1.prismaClient.document.findMany({
            where: { userId },
            select: { sizeInBytes: true },
        });
        // 🔹 Calcula o total utilizado
        const totalUsed = userFiles.reduce((sum, file) => sum + file.sizeInBytes / 100, 0);
        // 🔹 Calcula o espaço disponível
        const availableStorage = limiteStorage - totalUsed;
        return {
            totalUsed,
            availableStorage,
            totalLimit: limiteStorage,
        };
    }
}
exports.FetchUserStorageService = FetchUserStorageService;
