"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const prismaClient_1 = require("../../../database/prismaClient");
class UpdateUserService {
    async execute({ userId, email, password, firstName, lastName, empresa, }) {
        // Verifica se o ID do usuário foi fornecido
        if (!userId) {
            throw new Error('ID do usuário é obrigatório.');
        }
        // Verifica se o usuário existe
        const existingUser = await prismaClient_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new Error('Usuário não encontrado.');
        }
        // Prepara os dados para atualização
        const data = {};
        if (email)
            data.email = email;
        if (firstName)
            data.firstName = firstName;
        if (lastName)
            data.lastName = lastName;
        if (empresa)
            data.empresa = empresa;
        // Hash da nova senha, se fornecida
        if (password) {
            data.password = await (0, bcryptjs_1.hash)(password, 12);
        }
        // Atualiza o usuário no banco de dados
        const user = await prismaClient_1.prismaClient.user.update({
            where: { id: userId },
            data,
        });
        return user;
    }
}
exports.UpdateUserService = UpdateUserService;
