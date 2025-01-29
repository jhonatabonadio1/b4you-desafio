"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImovelService = void 0;
const mongodb_1 = require("mongodb");
const prismaClient_1 = require("../../../database/prismaClient");
class UpdateImovelService {
    async execute(data) {
        const { _id, propertyType, quartos, banheiros, garagem, descricao, state, cidade, valor, valorCondo, metragens, images, valorComissao, details, condominium, ownerName, ownerPhone, ownerEmail, ownerWhatsapp, userId, } = data;
        if (!_id) {
            throw new Error('O ID do imóvel é obrigatório.');
        }
        // Busca o imóvel pelo ID
        const property = await prismaClient_1.prismaClient.imovels.findUnique({
            where: { id: _id },
        });
        if (!property) {
            throw new Error('Imóvel não encontrado.');
        }
        // Verifica se o usuário atual é o dono do imóvel
        if (property.user !== userId) {
            throw new Error('Permissão negada.');
        }
        const metragensWithIds = metragens
            ? metragens.map((metragem) => ({
                id: new mongodb_1.ObjectId().toHexString(), // Gera um novo ObjectId para cada metragem
                value: metragem,
            }))
            : undefined;
        // Atualiza os campos do imóvel
        const updatedProperty = await prismaClient_1.prismaClient.imovels.update({
            where: { id: _id },
            data: {
                propertyType,
                quartos,
                banheiros,
                garagem,
                descricao,
                state,
                cidade,
                valor,
                valorCondo,
                metragens: metragensWithIds ? { set: metragensWithIds } : undefined,
                images,
                valorComissao,
                details,
                condominium,
                ownerName,
                ownerPhone,
                ownerEmail,
                ownerWhatsapp,
            },
        });
        return updatedProperty;
    }
}
exports.UpdateImovelService = UpdateImovelService;
