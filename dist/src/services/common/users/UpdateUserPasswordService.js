"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPasswordService = void 0;
const bcryptjs_1 = require("bcryptjs");
const prismaClient_1 = require("../../../database/prismaClient");
class UpdateUserPasswordService {
    async execute({ requestId, password }) {
        if (!requestId) {
            throw new Error('Request ID inválida.');
        }
        const findRequest = await prismaClient_1.prismaClient.recoveryRequests.findFirst({
            where: {
                id: requestId,
                valid: true,
            },
            include: {
                user: true,
            },
        });
        if (!findRequest) {
            throw new Error('Request ID inválida.');
        }
        if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{8,})/.test(password)) {
            throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um caractere especial.');
        }
        const currentTime = new Date();
        if (findRequest.expiresAt && findRequest.expiresAt < currentTime) {
            await prismaClient_1.prismaClient.recoveryRequests.update({
                where: { id: requestId },
                data: { valid: false },
            });
            throw new Error('O link de recuperação expirou.');
        }
        const isSamePassword = (await (0, bcryptjs_1.hash)(password, 12)) === findRequest.user.password;
        if (isSamePassword) {
            throw new Error('A nova senha não pode ser igual à senha antiga.');
        }
        const hashPassword = await (0, bcryptjs_1.hash)(password, 12);
        const user = await prismaClient_1.prismaClient.user.update({
            where: { id: findRequest.userId },
            data: {
                password: hashPassword,
            },
        });
        await prismaClient_1.prismaClient.recoveryRequests.update({
            where: { id: findRequest.id },
            data: { valid: false },
        });
        return user;
    }
}
exports.UpdateUserPasswordService = UpdateUserPasswordService;
