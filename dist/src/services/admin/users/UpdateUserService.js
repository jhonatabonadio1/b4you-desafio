"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UpdateUserService {
    async execute(id, updates) {
        if (!id) {
            throw new Error('ID é obrigatório.');
        }
        const user = await prismaClient_1.prismaClient.users.findUnique({
            where: { id },
        });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        const updatedData = {};
        if (updates.email)
            updatedData.email = updates.email;
        if (updates.nome)
            updatedData.nome = updates.nome;
        if (updates.role)
            updatedData.role = updates.role;
        if (updates.password) {
            const salt = bcryptjs_1.default.genSaltSync(10);
            updatedData.password = bcryptjs_1.default.hashSync(updates.password, salt);
        }
        const updatedUser = await prismaClient_1.prismaClient.users.update({
            where: { id },
            data: updatedData,
        });
        return updatedUser;
    }
}
exports.UpdateUserService = UpdateUserService;
