"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class DeleteUserService {
    async execute(id) {
        if (!id) {
            throw new Error('ID é obrigatório.');
        }
        const user = await prismaClient_1.prismaClient.users.findUnique({
            where: { id },
        });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        await prismaClient_1.prismaClient.users.delete({
            where: { id },
        });
        return { message: 'Usuário deletado com sucesso.' };
    }
}
exports.DeleteUserService = DeleteUserService;
