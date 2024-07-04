"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminService = void 0;
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchAdminService {
    async execute({ userId }) {
        const user = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                id: userId,
                deleted: false,
            },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const userWithoutSensiveKeys = exclude(user, ['password']);
        const response = Object.assign({}, userWithoutSensiveKeys);
        return response;
    }
}
exports.FetchAdminService = FetchAdminService;
