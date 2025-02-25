/* eslint-disable camelcase */
import { prismaClient } from '../../../database/prismaClient';
class VerifyCheckoutSessionExistsService {
    async execute({ sessionId, userId }) {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!sessionId) {
            throw new Error('ID da sessão não informado.');
        }
        console.log(sessionId);
        if (!userId) {
            throw new Error('Usuário inexistente');
        }
        const buscaSessao = await prismaClient.checkoutSession.findFirst({
            where: {
                checkoutSessionId: sessionId,
                userId,
            },
        });
        if (!buscaSessao) {
            throw new Error('Sessão inexistente');
        }
        return buscaSessao;
    }
}
export { VerifyCheckoutSessionExistsService };
//# sourceMappingURL=VerifyCheckoutSessionExistsService.js.map