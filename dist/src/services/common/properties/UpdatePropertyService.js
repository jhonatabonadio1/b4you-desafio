"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePropertyService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class UpdatePropertyService {
    async execute(data) {
        const { propertyId, propertyType, quartos, banheiros, garagem, paymentMethod, descricao, state, cidades, metragens, valores, nome, details, condominium, encaminhado, linkImovel, fonte, userId, } = data;
        if (!propertyId) {
            throw new Error('O ID da propriedade é obrigatório.');
        }
        // Busca a propriedade pelo ID e garante que o usuário é o proprietário ou administrador
        const property = await prismaClient_1.prismaClient.properties.findUnique({
            where: { id: propertyId },
        });
        if (!property || property.user !== userId) {
            throw new Error('Propriedade não encontrada ou usuário não autorizado.');
        }
        // Formatar valores como moeda local (BRL)
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        const formattedValores = valores.map((valor) => ({
            value: formatter.format(parseFloat(valor.value.replace(',', '.'))),
        }));
        // Adicionar IDs aos itens de `cidades` e `metragens`
        const cidadesWithIds = cidades.map((cidade) => ({
            value: cidade.value,
        }));
        const metragensWithIds = metragens.map((metragem) => ({
            value: metragem.value,
        }));
        // Atualiza os dados no banco de dados
        const updatedProperty = await prismaClient_1.prismaClient.properties.update({
            where: { id: propertyId },
            data: {
                propertyType: {
                    set: propertyType.map((type) => ({
                        value: type.value,
                    })),
                },
                details,
                condominium,
                quartos,
                banheiros,
                garagem,
                paymentMethod,
                descricao,
                state,
                cidades: {
                    set: cidadesWithIds, // Substitui com os novos dados incluindo IDs
                },
                metragens: {
                    set: metragensWithIds, // Substitui com os novos dados incluindo IDs
                },
                valores: {
                    set: formattedValores, // Substitui com os novos valores incluindo IDs
                },
                nome,
                encaminhado,
                linkImovel,
                fonte,
            },
        });
        return updatedProperty;
    }
}
exports.UpdatePropertyService = UpdatePropertyService;
