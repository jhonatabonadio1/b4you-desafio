"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInformativoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateInformativoService {
    async execute({ titulo, texto, bannerUrl, url }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        const informativo = await prismaClient_1.prismaClient.informativos.create({
            data: {
                titulo,
                texto,
                bannerUrl,
                url,
            },
        });
        return informativo;
    }
}
exports.CreateInformativoService = CreateInformativoService;
