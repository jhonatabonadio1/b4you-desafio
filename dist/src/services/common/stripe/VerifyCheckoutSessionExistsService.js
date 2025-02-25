"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCheckoutSessionExistsService = void 0;
/* eslint-disable camelcase */
const prismaClient_1 = require("../../../database/prismaClient");
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
        const buscaSessao = await prismaClient_1.prismaClient.checkoutSession.findFirst({
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
exports.VerifyCheckoutSessionExistsService = VerifyCheckoutSessionExistsService;
//# sourceMappingURL=VerifyCheckoutSessionExistsService.js.map