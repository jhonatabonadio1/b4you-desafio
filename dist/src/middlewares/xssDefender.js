import xssFilters from 'xss-filters';
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
                ? xssFilters.inHTMLData(obj[key])
                : sanitizeObject(obj[key]);
        return acc;
    }, {});
};
// Middleware para sanitizar entradas do req.body, req.query e req.params
export const defender = (req, res, next) => {
    req.body = sanitizeObject(req.body);
    req.query = sanitizeObject(req.query);
    req.params = sanitizeObject(req.params);
    next();
};
//# sourceMappingURL=xssDefender.js.map