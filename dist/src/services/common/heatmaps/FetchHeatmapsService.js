"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchHeatmapsService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchHeatmapsService {
    async execute({ docId, page, userId }) {
        if (!docId) {
            throw new Error('Documento inválido.');
        }
        if (!page) {
            throw new Error('Página do PDF é obrigatória');
        }
        const buscaDocumento = await prismaClient_1.prismaClient.document.findFirst({
            where: { id: docId },
        });
        if (!buscaDocumento) {
            throw new Error('Documento não encontrado.');
        }
        if ((buscaDocumento === null || buscaDocumento === void 0 ? void 0 : buscaDocumento.userId) !== userId) {
            throw new Error('Usuário não autorizado');
        }
        const buscaLotes = await prismaClient_1.prismaClient.loteHeatmaps.findMany({
            where: {
                docId,
            },
            select: {
                // Filtra os heatmaps para retornar somente os da página informada
                Heatmaps: {
                    where: {
                        page,
                    },
                },
            },
        });
        if (!buscaLotes || buscaLotes.length === 0) {
            throw new Error('Nenhum heatmap registrado para o documento informado.');
        }
        return buscaLotes;
    }
}
exports.FetchHeatmapsService = FetchHeatmapsService;
