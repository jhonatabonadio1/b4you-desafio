"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConvenioService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateConvenioService {
    async execute({ titulo, bannerUrl, texto, url, html, categoria }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
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
                bannerUrl: bannerUrl ||
                    'https://pip.global/static/1632e46a5c79d43f3125ca62c54189cb/ba986/hills_placeholder.png',
                url,
                html,
                ativo: true,
                categoria,
            },
        });
        return convenio;
    }
}
exports.CreateConvenioService = CreateConvenioService;
