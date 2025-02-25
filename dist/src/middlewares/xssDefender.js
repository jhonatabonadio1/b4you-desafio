"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defender = void 0;
const xss_filters_1 = __importDefault(require("xss-filters"));
// Função para sanitizar entradas de objetos
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] =
            typeof obj[key] === 'string'
                ? xss_filters_1.default.inHTMLData(obj[key])
                : sanitizeObject(obj[key]);
        return acc;
    }, {});
};
// Middleware para sanitizar entradas do req.body, req.query e req.params
const defender = (req, res, next) => {
    req.body = sanitizeObject(req.body);
    req.query = sanitizeObject(req.query);
    req.params = sanitizeObject(req.params);
    next();
};
exports.defender = defender;
//# sourceMappingURL=xssDefender.js.map