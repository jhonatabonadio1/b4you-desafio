"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConvenioService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class UpdateConvenioService {
    async execute({ id, titulo, texto, bannerUrl, url, html, categoria, ativo, }) {
        if (!id) {
            throw new Error('ID do convênio é obrigatório');
        }
        const existingConvenio = await prismaClient_1.prismaClient.convenios.findUnique({
            where: { id, deleted: false },
        });
        if (!existingConvenio) {
            throw new Error('Convênio não encontrado');
        }
        const updatedConvenio = await prismaClient_1.prismaClient.convenios.update({
            where: { id, deleted: false },
            data: {
                titulo: titulo || existingConvenio.titulo,
                texto: texto || existingConvenio.texto,
                bannerUrl: bannerUrl || existingConvenio.bannerUrl,
                url: url || existingConvenio.url,
                html: html || existingConvenio.html,
                ativo,
                categoria: categoria || existingConvenio.categoria,
            },
        });
        return updatedConvenio;
    }
}
exports.UpdateConvenioService = UpdateConvenioService;
