"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConvenioService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateConvenioService {
    async execute({ titulo, texto, bannerUrl, url, html, categoria }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        if (!bannerUrl) {
            throw new Error('URL do banner é obrigatório');
        }
        if (!categoria) {
            throw new Error('Categoria é obrigatório.');
        }
        if (!url) {
            throw new Error('URL de redirecionamento é obrigatório.');
        }
        const convenio = await prismaClient_1.prismaClient.convenios.create({
            data: {
                titulo,
                texto,
                bannerUrl,
                url,
                html,
                categoria,
            },
        });
        return convenio;
    }
}
exports.CreateConvenioService = CreateConvenioService;
