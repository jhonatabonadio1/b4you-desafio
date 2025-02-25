"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const removePassword_1 = require("./middlewares/removePassword");
const xssDefender_1 = require("./middlewares/xssDefender");
const csrf_1 = __importDefault(require("./middlewares/csrf"));
const csfrSecret_1 = require("./lib/csfrSecret");
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const webhookRoutes_1 = require("./routes/webhookRoutes");
const socket_1 = require("./socket");
dotenv_1.default.config();
const PORT = process.env.PORT || 3333;
const app = (0, express_1.default)();
const allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [
    'http://localhost:3000',
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
app.use(body_parser_1.default.raw());
const server = http_1.default.createServer(app);
const createSocket = async () => {
    await (0, socket_1.createSocketServer)(server);
};
createSocket();
app.use((0, helmet_1.default)());
app.disable('x-powered-by');
app.use('/api', webhookRoutes_1.webhookRoutes);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});
app.disable('etag');
app.use(xssDefender_1.defender);
app.use(removePassword_1.sanitizeResponse);
app.get('/api/csrf', (req, res) => {
    const token = csfrSecret_1.tokens.create(csfrSecret_1.secret);
    res.cookie('XSRF-TOKEN', token, { httpOnly: true });
    return res.json({ csrfToken: token });
});
app.use(csrf_1.default);
app.use('/api', routes_1.routes);
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
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
server.listen(PORT, () => console.log(`🔥 Servidor iniciado na porta ${PORT}`));
