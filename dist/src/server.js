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
const http_1 = __importDefault(require("http"));
const removePassword_1 = require("./middlewares/removePassword");
const xssDefender_1 = require("./middlewares/xssDefender");
const csrf_1 = __importDefault(require("./middlewares/csrf"));
const csfrSecret_1 = require("./lib/csfrSecret");
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const webhookRoutes_1 = require("./routes/webhookRoutes");
const socket_1 = require("./socket");
const api_1 = require("@bull-board/api");
const express_2 = require("@bull-board/express");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const uploadQueue_1 = require("./lib/uploadQueue");
dotenv_1.default.config();
const PORT = process.env.PORT || 3333;
const queue = new bullMQAdapter_1.BullMQAdapter(uploadQueue_1.uploadQueue);
const serverAdapter = new express_2.ExpressAdapter();
serverAdapter.setBasePath('/queues');
(0, api_1.createBullBoard)({
    queues: [queue],
    serverAdapter,
});
const app = (0, express_1.default)();
app.use('/queues', serverAdapter.getRouter());
app.use(body_parser_1.default.raw());
const server = http_1.default.createServer(app);
(0, socket_1.createSocketServer)(server);
const allowedOriginsProd = ['https://incorporae.com.br'];
const allowedOriginsDev = [
    'http://localhost:3000',
    'http://192.168.0.11:3000',
    'http://192.168.1.139:3000',
];
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
    credentials: true,
}));
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
//# sourceMappingURL=server.js.map