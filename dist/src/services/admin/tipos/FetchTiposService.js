"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchTiposService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchTiposService {
    async execute() {
        const tipos = await prismaClient_1.prismaClient.tipos.findMany();
        if (!tipos || tipos.length === 0) {
            throw new Error('Nenhum tipo encontrado.');
        }
        return tipos;
    }
}
exports.FetchTiposService = FetchTiposService;
