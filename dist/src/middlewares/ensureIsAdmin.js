"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureIsAdmin = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaClient_1 = require("../database/prismaClient");
async function ensureIsAdmin(request, response, next) {
    // Receber o tokenwww
    const authToken = request.headers.authorization;
    // Validar se token está preenchido
    if (!authToken) {
        return response.status(401).end();
    }
    const [, token] = authToken.split(' ');
    try {
        // Validar se token é válido
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.AUTH_TOKEN);
        // Recuperar informações do usuário
        request.userId = sub;
        const buscaUsuario = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                id: sub,
                deleted: false,
            },
        });
        if (!buscaUsuario) {
            return response.status(404).end();
        }
        if (buscaUsuario.tipoAcesso !== 'admin') {
            return response.status(401).end();
        }
        return next();
    }
    catch (err) {
        return response.status(401).end();
    }
}
exports.ensureIsAdmin = ensureIsAdmin;
