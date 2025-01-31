"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_slow_down_1 = __importDefault(require("express-slow-down"));
const routes_1 = require("./routes/routes");
const removePassword_1 = require("./middlewares/removePassword");
const xssDefender_1 = require("./middlewares/xssDefender");
const csrf_1 = __importDefault(require("./middlewares/csrf"));
const csfrSecret_1 = require("./lib/csfrSecret");
dotenv_1.default.config();
const PORT = process.env.PORT || 3333;
const app = (0, express_1.default)();
// 🚀 Proteção contra força bruta
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo de 100 requisições por IP
    message: 'Muitas requisições. Tente novamente mais tarde.',
});
// 🚀 Proteção contra ataques DDoS
const speedLimiter = (0, express_slow_down_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    delayAfter: 50, // Começa a aplicar delay após 50 requisições
    delayMs: () => 500, // Adiciona 500ms de delay fixo por requisição após `delayAfter`
});
// 🚀 Middlewares essenciais
const allowedOriginsProd = ['https://app.ymobis.com'];
const allowedOriginsDev = ['http://localhost:3000'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            (process.env.ENV === 'DEV'
                ? allowedOriginsDev.includes(origin)
                : allowedOriginsProd.includes(origin))) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // 🔥 Permite cookies e autenticação
}));
app.use((0, helmet_1.default)());
app.disable('x-powered-by');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 🚀 Proteção contra cache indevido
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});
// 🚀 Desativa ETag para evitar cache
app.disable('etag');
// 🚀 Proteção contra força bruta e DDoS
app.use(limiter);
app.use(speedLimiter);
// 🚀 Middleware para sanitizar entrada de usuários (Proteção contra XSS)
app.use(xssDefender_1.defender);
// 🚀 Middleware para remover senha das respostas
app.use(removePassword_1.sanitizeResponse);
app.get('/api/csrf', (req, res) => {
    const token = csfrSecret_1.tokens.create(csfrSecret_1.secret);
    // Set CSRF token as an HTTP-only cookie
    const response = res.json({ csrfToken: token });
    response.cookie('XSRF-TOKEN', token, { httpOnly: true });
    return response;
});
// 🚀 Middleware para processar cookies (necessário para CSRF)
app.use(csrf_1.default);
// 📌 Rota para pegar o token CSRF manualmente (opcional)
// 🚀 Rotas protegidas (depois do CSRF!)
app.use('/api', routes_1.authRoutes);
// 🚀 Middleware de erro global
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});
// 🚀 Inicia o servidor
app.listen(PORT, () => console.log(`🔥 Servidor iniciado na porta ${PORT}`));
