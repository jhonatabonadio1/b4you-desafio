/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import { sanitizeResponse } from './middlewares/removePassword';
import { defender } from './middlewares/xssDefender';
import csrfMiddleware from './middlewares/csrf';
import { secret, tokens } from './lib/csfrSecret';
import { routes } from './routes/routes';
import bodyParser from 'body-parser';
import { adminJs, adminRouter } from './lib/admin';
import { webhookRoutes } from './routes/webhookRoutes';
import { createSocketServer } from './socket';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { uploadQueue } from './lib/uploadQueue';
dotenv.config();
const PORT = process.env.PORT || 3333;
const queue = new BullMQAdapter(uploadQueue);
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');
createBullBoard({
    queues: [queue],
    serverAdapter,
});
const app = express();
app.use('/queues', serverAdapter.getRouter());
app.use(adminJs.options.rootPath, adminRouter);
app.use(bodyParser.raw());
const server = http.createServer(app);
await createSocketServer(server);
const allowedOriginsProd = ['https://incorporae.com.br'];
const allowedOriginsDev = [
    'http://localhost:3000',
    'http://192.168.0.11:3000',
    'http://192.168.1.139:3000',
];
app.use(cors({
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
app.use(helmet());
app.disable('x-powered-by');
app.use('/api', webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});
app.disable('etag');
app.use(defender);
app.use(sanitizeResponse);
app.get('/api/csrf', (req, res) => {
    const token = tokens.create(secret);
    res.cookie('XSRF-TOKEN', token, { httpOnly: true });
    return res.json({ csrfToken: token });
});
app.use(csrfMiddleware);
app.use('/api', routes);
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