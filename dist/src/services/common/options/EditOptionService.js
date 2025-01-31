"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditOptionService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class EditOptionService {
    async execute(userId, propertyId, linkId, data) {
        if (!propertyId || !linkId) {
            throw new Error('O ID da propriedade e do link são obrigatórios.');
        }
        // Valida os campos obrigatórios
        const requiredFields = ['link', 'motivo'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Campo obrigatório: ${field}`);
            }
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
            include: { links: true }, // Inclui os links na busca
        });
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }
        // Verifica se o usuário tem permissão
        if (user.role !== 'admin' && property.user !== userId) {
            throw new Error('Você não tem permissão para editar este link.');
        }
        // Verifica se o link existe
        const linkToUpdate = property.links.find((link) => link.id === linkId);
        if (!linkToUpdate) {
            throw new Error('Link não encontrado.');
        }
        // Atualiza o link específico
        await prismaClient_1.prismaClient.properties.update({
            where: { id: propertyId },
            data: {
                links: {
                    updateMany: {
                        where: { id: linkId },
                        data: {
                            link: data.link,
                            motivo: data.motivo,
                            encaminhado: data.encaminhado,
                            updated_at: new Date(),
                        },
                    },
                },
            },
        });
        return { message: 'Link atualizado com sucesso.' };
    }
}
exports.EditOptionService = EditOptionService;
