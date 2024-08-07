"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInformativoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class UpdateInformativoService {
    async execute({ id, titulo, html, texto, bannerUrl, url }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        const informativo = await prismaClient_1.prismaClient.informativos.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!informativo) {
            throw new Error('Informativo não encontrado');
        }
        const updateInformativo = await prismaClient_1.prismaClient.informativos.update({
            where: {
                id,
                deleted: false,
            },
            data: {
                titulo: titulo || informativo.titulo,
                texto: texto || informativo.texto,
                bannerUrl: bannerUrl || informativo.bannerUrl,
                html: html || informativo.html,
                url: url || informativo.url,
            },
        });
        return updateInformativo;
    }
}
exports.UpdateInformativoService = UpdateInformativoService;
