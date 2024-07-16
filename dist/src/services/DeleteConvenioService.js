"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteConvenioService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteConvenioService {
    async execute({ id }) {
        const convenio = await prismaClient_1.prismaClient.convenios.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!convenio) {
            throw new Error('Convênio não encontrado');
        }
        const deleteConvenio = await prismaClient_1.prismaClient.convenios.update({
            where: {
                id,
                deleted: false,
            },
            data: {
                deleted: true,
            },
        });
        return deleteConvenio;
    }
}
exports.DeleteConvenioService = DeleteConvenioService;
