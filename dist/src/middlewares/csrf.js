"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const csfrSecret_1 = require("../lib/csfrSecret");
(0, dotenv_1.config)();
const csrfMiddleware = (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const excludedRoutes = ['/api/stripe/webhook'];
        // Verifica se a rota atual está na lista de exclusão
        if (excludedRoutes.includes(req.path)) {
            return next();
        }
        try {
            const csrfToken = req.header('X-CSRF-Token');
            if (!csfrSecret_1.tokens.verify(csfrSecret_1.secret, csrfToken)) {
                return res.status(403).json({ error: 'Invalid CSRF token' });
            }
        }
        catch {
            return res.status(403).json({ error: 'Invalid CSRF token' });
        }
    }
    next();
};
exports.default = csrfMiddleware;
//# sourceMappingURL=csrf.js.map