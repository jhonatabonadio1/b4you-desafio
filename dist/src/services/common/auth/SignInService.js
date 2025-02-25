"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../../../database/prismaClient");
class SignInService {
    async execute({ email, password }) {
        const { sign } = jsonwebtoken_1.default;
        if (!email) {
            throw new Error('E-mail é obrigatório.');
        }
        if (!password) {
            throw new Error('Senha é obrigatória.');
        }
        // Busca o usuário no banco de dados
        const user = await prismaClient_1.prismaClient.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error('E-mail/Senha incorretos.');
        }
        // Compara a senha informada com a senha armazenada
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new Error('E-mail/Senha incorretos.');
        }
        // Geração do token JWT
        const token = sign({
            userId: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            subject: user.id,
            expiresIn: '7d',
        });
        return {
            token,
            user,
        };
    }
}
exports.SignInService = SignInService;
//# sourceMappingURL=SignInService.js.map