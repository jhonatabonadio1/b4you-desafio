"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProductPrestadoresService = void 0;
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchProductPrestadoresService {
    async execute({ produtoId }) {
        const findProducts = await prismaClient_1.prismaClient.servico.findFirst({
            where: { id: produtoId, deleted: false },
        });
        const prestadores = [];
        if (findProducts) {
            for (const prestadorId of findProducts.prestadores) {
                const buscaPrestador = await prismaClient_1.prismaClient.prestador.findFirst({
                    where: { id: prestadorId, deleted: false, ativo: true },
                });
                if (buscaPrestador) {
                    prestadores.push(exclude(buscaPrestador, [
                        'password',
                        'deleted',
                        'inscricao',
                        'tipoInscricao',
                        'email',
                    ]));
                }
            }
        }
        return prestadores;
    }
}
exports.FetchProductPrestadoresService = FetchProductPrestadoresService;
