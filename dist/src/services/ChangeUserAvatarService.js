"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUserAvatarService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class ChangeUserAvatarService {
    async execute({ tipoAcesso, userId, imageUrl }) {
        let user;
        if (tipoAcesso === 1) {
            user = await prismaClient_1.prismaClient.usuario.findFirst({
                where: {
                    id: userId,
                    deleted: false,
                },
            });
        }
        else {
            user = await prismaClient_1.prismaClient.prestador.findFirst({
                where: {
                    id: userId,
                    deleted: false,
                },
            });
        }
        if (!user) {
            throw new Error('Usuário não encontrado/inválido.');
        }
        const atualizaUsuario = await prismaClient_1.prismaClient.usuario.update({
            where: {
                id: user.id,
            },
            data: {
                avatarUrl: imageUrl,
            },
        });
        return atualizaUsuario;
    }
}
exports.ChangeUserAvatarService = ChangeUserAvatarService;
