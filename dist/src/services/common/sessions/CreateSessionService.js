"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSessionService = void 0;
const DefaultApplicationRules_1 = require("../../../config/DefaultApplicationRules");
const prismaClient_1 = require("../../../database/prismaClient");
class CreateSessionService {
    async execute({ docId, network, fingerprint }) {
        if (!fingerprint || !docId) {
            throw new Error('Preencha os campos obrigatórios.');
        }
        const buscaDocumento = await prismaClient_1.prismaClient.document.findFirst({
            where: {
                id: docId,
            },
            select: {
                user: true,
            },
        });
        if (!buscaDocumento) {
            throw new Error('Documento não encontrado');
        }
        let maxSessionPerFile = DefaultApplicationRules_1.defaultApplicationRules.sessions.maxSessionsPerFile;
        const buscaInscricaoDonoDocumento = await prismaClient_1.prismaClient.subscription.findFirst({
            where: {
                active: true,
                userId: buscaDocumento.user.id,
                status: 'active',
                endDate: {
                    gte: new Date(),
                },
            },
            select: {
                plan: true,
            },
        });
        if (buscaInscricaoDonoDocumento) {
            maxSessionPerFile = buscaInscricaoDonoDocumento.plan.fileSessions;
        }
        const contagemSessoes = await prismaClient_1.prismaClient.session.count({
            where: {
                docId,
            },
        });
        if (contagemSessoes >= maxSessionPerFile) {
            throw new Error('Limite de sessões por arquivo atingido. Faça upgrade do plano.');
        }
        const lastSession = await prismaClient_1.prismaClient.session.findFirst({
            where: { fingerprint, network },
            orderBy: { createdAt: 'desc' }, // Ordena pela mais recente
        });
        if (lastSession) {
            // Calcula a diferença de tempo entre agora e a última sessão
            const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutos em milissegundos
            const lastSessionTime = new Date(lastSession.createdAt).getTime();
            const now = Date.now();
            if (now - lastSessionTime < FIVE_MINUTES) {
                // Se a última sessão ainda estiver válida, retorna a existente
                return {
                    sessionId: lastSession.id,
                };
            }
        }
        // Cria a nova sessão, pois já passou o tempo mínimo
        const session = await prismaClient_1.prismaClient.session.create({
            data: { docId, fingerprint, network },
        });
        return {
            sessionId: session.id,
        };
    }
}
exports.CreateSessionService = CreateSessionService;
//# sourceMappingURL=CreateSessionService.js.map