// src/services/authService.ts
import jwt from 'jsonwebtoken';
import { prismaClient } from '../database/prismaClient';
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Verifica se token é válido e se userId do token é o mesmo que o userId do documento
 */
export async function isOwnerOfDocument(token, documentId) {
    try {
        const payload = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        const userId = payload.userId;
        // Carrega o documento do BD
        const doc = await prismaClient.document.findUnique({
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