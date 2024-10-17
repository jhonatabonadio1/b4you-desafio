"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceInfoService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        const prestadores = [];
        for (const id of findProduct.prestadores) {
            const prestador = await prismaClient_1.prismaClient.prestador.findFirst({
                where: { id, deleted: false },
            });
            if (prestador) {
                const prestadorItem = {
                    razaoSocial: prestador === null || prestador === void 0 ? void 0 : prestador.razaoSocial,
                    inscricao: prestador === null || prestador === void 0 ? void 0 : prestador.inscricao,
                    id: prestador.id,
                };
                prestadores.push(prestadorItem);
            }
        }
        console.log(prestadores);
        return Object.assign(Object.assign({}, findProduct), { prestadores });
    }
}
exports.GetServiceInfoService = GetServiceInfoService;
