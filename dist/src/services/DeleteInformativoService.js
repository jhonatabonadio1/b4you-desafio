"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteInformativoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteInformativoService {
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
        const deleteInformativo = await prismaClient_1.prismaClient.informativos.update({
            where: {
                id,
                deleted: false,
            },
            data: {
                deleted: true,
            },
        });
        return deleteInformativo;
    }
}
exports.DeleteInformativoService = DeleteInformativoService;
