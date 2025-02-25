"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function ensureAuthenticated(request, response, next) {
    const { verify } = jsonwebtoken_1.default;
    // Receber o token
    const authToken = request.headers.authorization;
    // Validar se token está preenchido
    if (!authToken) {
        return response.status(401).end();
    }
    const [, token] = authToken.split(' ');
    try {
        // Validar se token é válido
        const { sub } = verify(token, process.env.JWT_SECRET);
        // Recuperar informações do usuário
        request.userId = sub;
        return next();
    }
    catch (err) {
        return response.status(401).end();
    }
}
//# sourceMappingURL=ensureIsAuthenticated.js.map