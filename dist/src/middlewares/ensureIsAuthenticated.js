"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function ensureAuthenticated(request, response, next) {
    // Receber o token
    const authToken = request.headers.authorization;
    // Validar se token está preenchido
    if (!authToken) {
        return response.status(401).end();
    }
    const [, token] = authToken.split(' ');
    try {
        // Validar se token é válido
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // Recuperar informações do usuário
        request.userId = sub;
        return next();
    }
    catch (err) {
        return response.status(401).end();
    }
}
exports.ensureAuthenticated = ensureAuthenticated;
