import { prismaClient } from '../../../database/prismaClient';
export class FetchDocumentTrackingService {
    async execute(docId, userId, dataInicio, dataFim) {
        if (!docId) {
            throw new Error('Documento inválido.');
        }
        const buscaDocumento = await prismaClient.document.findFirst({
            where: { id: docId },
        });
        if (!buscaDocumento) {
            throw new Error('Documento não encontrado.');
        }
        if (buscaDocumento?.userId !== userId) {
            throw new Error('Usuário não autorizado');
        }
        const whereClause = { session: { docId } };
        if (dataInicio || dataFim) {
            whereClause.createdAt = {};
            if (dataInicio)
                whereClause.createdAt.gte = dataInicio;
            if (dataFim)
                whereClause.createdAt.lte = dataFim;
        }
        const pageViews = await prismaClient.pageView.findMany({
            where: whereClause,
            select: {
                pageNumber: true,
                interactionTime: true,
            },
        });
        if (pageViews.length === 0) {
            return {
                totalViews: 0,
                totalInteractionTime: 0,
                averageTimePerPage: 0,
                sessions: 0,
            };
        }
        // Total de visualizações
        const totalViews = pageViews.length;
        // Tempo total de interação
        const totalInteractionTime = pageViews.reduce((acc, view) => acc + view.interactionTime, 0);
        // Média de tempo por página
        const averageTimePerPage = totalInteractionTime / totalViews;
        // Página com mais interação
        const pageInteractionMap = {};
        pageViews.forEach(({ pageNumber, interactionTime }) => {
            pageInteractionMap[pageNumber] =
                (pageInteractionMap[pageNumber] || 0) + interactionTime;
        });
        const sessionsCount = await prismaClient.session.count({
            where: {
                docId,
                createdAt: {
                    gte: dataInicio,
                    lte: dataFim,
                },
            },
        });
        return {
            totalViews,
            totalInteractionTime,
            averageTimePerPage,
            sessions: sessionsCount,
        };
    }
}
//# sourceMappingURL=FetchDocumentTrackingService.js.map