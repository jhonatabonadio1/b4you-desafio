"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTipoService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class CreateTipoService {
    async execute(nome) {
        if (!nome) {
            throw new Error('O nome do tipo é obrigatório.');
        }
        const tipoExistente = await prismaClient_1.prismaClient.tipos.findFirst({
            where: { nome },
        });
        if (tipoExistente) {
            throw new Error('Tipo já cadastrado.');
        }
        const tipo = await prismaClient_1.prismaClient.tipos.create({
            data: { v: 0, nome },
        });
        return tipo;
    }
}
exports.CreateTipoService = CreateTipoService;
