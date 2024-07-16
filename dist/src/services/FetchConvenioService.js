"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchConvenioService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchConvenioService {
    async execute({ id }) {
        if (!id) {
            throw new Error('ID do convênio é obrigatório');
        }
        const existingConvenio = await prismaClient_1.prismaClient.convenios.findUnique({
            where: { id, deleted: false },
        });
        if (!existingConvenio) {
            throw new Error('Convênio não encontrado');
        }
        return existingConvenio;
    }
}
exports.FetchConvenioService = FetchConvenioService;
