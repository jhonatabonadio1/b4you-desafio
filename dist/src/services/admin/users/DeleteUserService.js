"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class DeleteUserService {
    async execute(id) {
        if (!id) {
            throw new Error('ID é obrigatório.');
        }
        const user = await prismaClient_1.prismaClient.users.findFirst({
            where: { id, deleted: false },
        });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        await prismaClient_1.prismaClient.users.update({
            where: { id },
            data: {
                deleted: true,
            },
        });
        return { message: 'Usuário deletado com sucesso.' };
    }
}
exports.DeleteUserService = DeleteUserService;
