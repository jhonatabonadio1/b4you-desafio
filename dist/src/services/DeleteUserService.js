"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class DeleteUserService {
    async execute({ usuarioId }) {
        const user = await prismaClient_1.prismaClient.usuario.findUnique({
            where: { id: usuarioId, deleted: false },
        });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        const updateUserService = await prismaClient_1.prismaClient.usuario.update({
            where: { id: user.id, deleted: false },
            data: {
                deleted: true,
            },
        });
        const userWithoutSensiveKeys = exclude(updateUserService, ['password']);
        return userWithoutSensiveKeys;
    }
}
exports.DeleteUserService = DeleteUserService;
