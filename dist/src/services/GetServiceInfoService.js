"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceInfoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class GetServiceInfoService {
    async execute({ id }) {
        const findProduct = await prismaClient_1.prismaClient.servico.findFirst({
            where: { id, deleted: false },
            include: {
                opcoesAdicionais: true,
            },
        });
        if (!findProduct) {
            throw new Error('Serviço não encontrado.');
        }
        return findProduct;
    }
}
exports.GetServiceInfoService = GetServiceInfoService;
