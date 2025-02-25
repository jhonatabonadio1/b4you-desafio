"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureHeatmapsService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class CaptureHeatmapsService {
    async execute({ docId, sessionId, lote }) {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!docId) {
            throw new Error('ID do documento é obrigatório.');
        }
        if (!sessionId) {
            throw new Error('Sessão inválida.');
        }
        if (lote.length <= 0) {
            throw new Error('Lote de heatmaps é obrigatório.');
        }
        const ONE_MINUTE = 1 * 60 * 1000; // 1 minuto em milissegundos
        // Busca a última sessão vinculada ao mesmo `docId`
        const lastDocSession = await prismaClient_1.prismaClient.session.findFirst({
            where: { docId },
            orderBy: { createdAt: 'desc' },
        });
        // Verifica se a última sessão associada ao `docId` tem `collectedHeatmap = true`
        if (lastDocSession && lastDocSession.collectedHeatmap) {
            // Alterna o estado da última sessão para `false` e bloqueia este envio
            await prismaClient_1.prismaClient.session.update({
                where: { id: lastDocSession.id },
                data: { collectedHeatmap: false },
            });
            return {
                message: 'Este envio foi ignorado devido à alternância de registros para este documento.',
            };
        }
        // Verifica se a última coleta para a `sessionId` ocorreu há menos de 1 minuto
        const lastSessionHeatmap = await prismaClient_1.prismaClient.loteHeatmaps.findFirst({
            where: { sessionId },
            orderBy: { createdAt: 'desc' },
        });
        if (lastSessionHeatmap) {
            const lastSessionTime = new Date(lastSessionHeatmap.createdAt).getTime();
            const now = Date.now();
            if (now - lastSessionTime < ONE_MINUTE) {
                throw new Error('Aguarde antes de registrar um novo lote de heatmaps para esta sessão.');
            }
        }
        // Criar novo lote de heatmaps e definir `collectedHeatmap = true` para esta sessão
        const createLoteHeatmaps = await prismaClient_1.prismaClient.loteHeatmaps.create({
            data: {
                docId,
                sessionId,
            },
        });
        if (!createLoteHeatmaps) {
            throw new Error('Não foi possível criar o lote de heatmaps.');
        }
        // Filtrar lote para garantir que cada item tenha página válida
        const loteVerificado = lote.filter((item) => item.page != null);
        const uploadCarga = await prismaClient_1.prismaClient.heatmaps.createMany({
            data: loteVerificado.map((item) => (Object.assign({ loteId: createLoteHeatmaps.id }, item))),
        });
        if (!uploadCarga) {
            throw new Error('Não foi possível carregar o lote.');
        }
        // Atualiza a sessão atual para `collectedHeatmap = true`
        await prismaClient_1.prismaClient.session.update({
            where: { id: sessionId },
            data: { collectedHeatmap: true },
        });
        return { message: 'Lote carregado com sucesso.' };
    }
}
exports.CaptureHeatmapsService = CaptureHeatmapsService;
