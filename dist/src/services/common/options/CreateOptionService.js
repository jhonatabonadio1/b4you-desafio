"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOptionService = void 0;
const mongodb_1 = require("mongodb");
const prismaClient_1 = require("../../../database/prismaClient");
class CreateOptionService {
    async execute({ token, propertyId, link, motivo, encaminhado, userId, }) {
        // Verifica se o token foi fornecido
        const findUser = await prismaClient_1.prismaClient.users.findUnique({
            where: { id: userId },
        });
        if (!findUser) {
            throw new Error('Usuário não encontrado');
        }
        if (!token) {
            throw new Error('Token não fornecido.');
        }
        // Validação do ID da propriedade
        if (!propertyId) {
            throw new Error('O ID da propriedade é obrigatório.');
        }
        // Validação dos campos obrigatórios
        if (!link) {
            throw new Error('O campo "link" é obrigatório.');
        }
        // Busca a propriedade no banco de dados
        const property = await prismaClient_1.prismaClient.properties.findUnique({
            where: {
                id: propertyId,
            },
            include: {
                links: true,
            },
        });
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }
        // Verifica se o usuário é o proprietário ou administrador
        if (property.user !== findUser.id && findUser.role !== 'admin') {
            throw new Error('Não autorizado.');
        }
        // Criação de um novo link
        const newLink = {
            id: new mongodb_1.ObjectId().toHexString(), // Gera um ID único para o link
            link,
            motivo,
            encaminhado,
        };
        // Atualiza a propriedade adicionando o novo link
        await prismaClient_1.prismaClient.properties.update({
            where: {
                id: propertyId,
            },
            data: {
                links: {
                    push: newLink, // Adiciona o novo link ao array
                },
            },
        });
        return { newLinkId: newLink.id };
    }
}
exports.CreateOptionService = CreateOptionService;
