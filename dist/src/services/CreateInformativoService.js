"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInformativoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateInformativoService {
    async execute({ titulo, texto, html, bannerUrl, url }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        const informativo = await prismaClient_1.prismaClient.informativos.create({
            data: {
                titulo,
                texto,
                html,
                bannerUrl: bannerUrl ||
                    'https://pip.global/static/1632e46a5c79d43f3125ca62c54189cb/ba986/hills_placeholder.png',
                url,
            },
        });
        return informativo;
    }
}
exports.CreateInformativoService = CreateInformativoService;
