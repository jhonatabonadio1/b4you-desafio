"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserDataService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchUserDataService {
    async execute(userId) {
        if (!userId) {
            throw new Error('O ID do usuário é obrigatório.');
        }
        // Busca o usuário no banco de dados sem incluir o campo de senha
        const user = await prismaClient_1.prismaClient.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        return user;
    }
}
exports.FetchUserDataService = FetchUserDataService;
//# sourceMappingURL=FetchUserDataService.js.map