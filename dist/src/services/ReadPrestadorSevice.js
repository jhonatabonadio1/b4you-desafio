"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadPrestadorService = void 0;
const prismaClient_1 = require("../database/prismaClient");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class ReadPrestadorService {
    async execute({ prestadorId }) {
        const user = await prismaClient_1.prismaClient.prestador.findUnique({
            where: { id: prestadorId, deleted: false },
        });
        if (user) {
            const userWithoutPassword = exclude(user, ['password']);
            return userWithoutPassword;
        }
    }
}
exports.ReadPrestadorService = ReadPrestadorService;
