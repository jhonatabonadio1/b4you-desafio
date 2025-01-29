"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavePropertyService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class SavePropertyService {
    async execute(data) {
        const { propertyType, quartos, banheiros, garagem, paymentMethod, descricao, state, cidades, metragens, valores, userId, nome, details, condominium, } = data;
        // Gera um código único para o cliente
        const clientCode = await this.gerarNumeroUnicoDeQuatroDigitos();
        const metragensWithId = metragens.map((value) => ({
            value: value.value,
        }));
        const typesWithId = propertyType.map((value) => ({
            value: value.value,
        }));
        const valuesWithId = valores.map((value) => ({
            value: value.value,
        }));
        const cidadesWithId = cidades.map((value) => ({
            value: value.value,
        }));
        // Salva a propriedade no banco de dados
        const property = await prismaClient_1.prismaClient.properties.create({
            data: {
                propertyType: typesWithId,
                v: 0,
                quartos,
                details,
                condominium,
                nome,
                banheiros,
                garagem,
                paymentMethod,
                descricao,
                state,
                cidades: cidadesWithId,
                metragens: metragensWithId,
                valores: valuesWithId,
                user: userId,
                clientCode: clientCode.toString(),
                timestamp: new Date(),
            },
        });
        return property;
    }
    async gerarNumeroUnicoDeQuatroDigitos() {
        let numeroAleatorio = 0;
        let numeroExiste = true;
        while (numeroExiste) {
            numeroAleatorio = Math.floor(1000 + Math.random() * 9000); // Gera número aleatório de 4 dígitos
            const propriedadeExistente = await prismaClient_1.prismaClient.properties.findFirst({
                where: { clientCode: numeroAleatorio.toString() },
            });
            if (!propriedadeExistente) {
                numeroExiste = false;
            }
        }
        return numeroAleatorio;
    }
}
exports.SavePropertyService = SavePropertyService;
