"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3333;
const app = (0, express_1.default)();
const allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [
    'http://127.0.0.1:3000',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições feitas a partir deste IP, tente novamente mais tarde.',
});
app.use(limiter);
app.use(body_parser_1.default.raw());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.routes);
app.use(async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});
app.get('/health', (req, res) => {
    const logFilePath = path_1.default.resolve('app.log');
    fs_1.default.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os logs.');
        }
        res.type('text/plain').send(data);
    });
});
app.listen(PORT, () => console.log(`🔥 Servidor iniciado na porta ${PORT}`));
