"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePropertyService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class DeletePropertyService {
    async execute(propertyId, userId) {
        if (!propertyId) {
            throw new Error('O ID da propriedade é obrigatório.');
        }
        // Busca o usuário pelo ID
        const user = await prismaClient_1.prismaClient.users.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        // Busca a propriedade pelo ID
        const property = await prismaClient_1.prismaClient.properties.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }
        // Verifica se o usuário tem permissão para excluir
        if (user.role !== 'admin' && property.user !== userId) {
            throw new Error('Você não tem permissão para excluir esta propriedade.');
        }
        // Exclui a propriedade do banco de dados
        await prismaClient_1.prismaClient.properties.delete({
            where: { id: propertyId },
        });
        return { message: 'Propriedade excluída com sucesso.' };
    }
}
exports.DeletePropertyService = DeletePropertyService;
