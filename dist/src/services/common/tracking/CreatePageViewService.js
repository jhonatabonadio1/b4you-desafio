import { prismaClient } from '../../../database/prismaClient';
class CreatePageViewService {
    async execute({ sessionId, fingerprint, pageViews, viaWebsocket, }) {
        if (!sessionId)
            throw new Error('Sessão inválida');
        if (!pageViews.length)
            throw new Error('Nenhuma página informada');
        // Verifica se a sessão é válida
        const buscaSessaoValida = await prismaClient.session.findFirst({
            where: { id: sessionId, fingerprint },
        });
        if (!buscaSessaoValida)
            throw new Error('Sessão inválida');
        for (const { pageNumber, interactionTime } of pageViews) {
            if (!pageNumber || interactionTime <= 0)
                continue; // Ignora entradas inválidas
            const buscaVisualizacao = await prismaClient.pageView.findFirst({
                where: { sessionId, pageNumber },
            });
            if (buscaVisualizacao) {
                // Atualiza o tempo de interação se a página já foi registrada
                await prismaClient.pageView.update({
                    where: { id: buscaVisualizacao.id },
                    data: {
                        interactionTime: buscaVisualizacao.interactionTime + interactionTime,
                    },
                });
            }
            else {
                // Cria um novo registro para a página
                await prismaClient.pageView.create({
                    data: { sessionId, pageNumber, interactionTime, viaWebsocket },
                });
            }
        }
        return { message: 'Dados salvos com sucesso' };
    }
}
export { CreatePageViewService };
//# sourceMappingURL=CreatePageViewService.js.map