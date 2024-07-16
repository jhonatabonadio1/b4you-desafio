"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchInformativoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchInformativoService {
    async execute({ id }) {
        const informativo = await prismaClient_1.prismaClient.informativos.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!informativo) {
            throw new Error('Informativo não encontrado');
        }
        return informativo;
    }
}
exports.FetchInformativoService = FetchInformativoService;
