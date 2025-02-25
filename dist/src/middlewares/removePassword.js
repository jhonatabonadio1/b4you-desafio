"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeResponse = void 0;
// Função para remover 'password' de qualquer objeto ou array
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date) {
        return obj.toISOString(); // Converte para formato ISO 8601
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    return Object.keys(obj).reduce((acc, key) => {
        if (key !== 'password') {
            acc[key] = sanitizeObject(obj[key]);
        }
        return acc;
    }, {});
};
// Middleware para filtrar password antes de enviar resposta JSON
const sanitizeResponse = (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        const sanitizedData = sanitizeObject(data);
        return originalJson.call(this, sanitizedData);
    };
    next();
};
exports.sanitizeResponse = sanitizeResponse;
//# sourceMappingURL=removePassword.js.map