"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnerOfDocument = isOwnerOfDocument;
// src/services/authService.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../database/prismaClient");
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Verifica se token é válido e se userId do token é o mesmo que o userId do documento
 */
async function isOwnerOfDocument(token, documentId) {
    try {
        const payload = jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), JWT_SECRET);
        const userId = payload.userId;
        // Carrega o documento do BD
        const doc = await prismaClient_1.prismaClient.document.findUnique({
            where: { id: documentId },
            select: { userId: true },
        });
        if (!doc)
            return false;
        // Se userId do doc === userId do token => é dono
        return doc.userId === userId;
    }
    catch (err) {
        return false;
    }
}
//# sourceMappingURL=authSocket.js.map