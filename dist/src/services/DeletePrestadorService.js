"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePrestadorService = void 0;
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class DeletePrestadorService {
    async execute({ prestadorId }) {
        const user = await prismaClient_1.prismaClient.prestador.findUnique({
            where: { id: prestadorId, deleted: false },
        });
        if (!user) {
            throw new Error('Prestador não encontrado.');
        }
        const updateUserService = await prismaClient_1.prismaClient.prestador.update({
            where: { id: user.id },
            data: {
                deleted: true,
            },
        });
        const userWithoutSensiveKeys = exclude(updateUserService, ['password']);
        return userWithoutSensiveKeys;
    }
}
exports.DeletePrestadorService = DeletePrestadorService;
