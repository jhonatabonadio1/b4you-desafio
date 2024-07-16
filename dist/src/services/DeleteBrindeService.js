"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBrindeService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteBrindeService {
    async execute({ id }) {
        const brinde = await prismaClient_1.prismaClient.brinde.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!brinde) {
            throw new Error('Brinde não encontrado');
        }
        const deleteBrinde = await prismaClient_1.prismaClient.brinde.update({
            where: {
                id,
                deleted: false,
            },
            data: {
                deleted: true,
            },
        });
        return deleteBrinde;
    }
}
exports.DeleteBrindeService = DeleteBrindeService;
