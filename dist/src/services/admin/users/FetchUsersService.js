"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsersService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchUsersService {
    async execute(id) {
        if (id) {
            const user = await prismaClient_1.prismaClient.users.findUnique({
                where: { id },
            });
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            return exclude(user, ['password']);
        }
        const users = await prismaClient_1.prismaClient.users.findMany();
        return users;
    }
}
exports.FetchUsersService = FetchUsersService;
