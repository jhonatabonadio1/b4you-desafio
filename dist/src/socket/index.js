"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const socketHandlers_1 = require("./socketHandlers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Carregue .env se necessário
// import dotenv from 'dotenv'
// dotenv.config()
async function createSocketServer(httpServer) {
    // Cria instância do Socket.io
    const io = new socket_io_1.Server(httpServer);
    // Conecta ao Redis
    const REDIS_URL = process.env.REDIS_URL;
    const pubClient = (0, redis_1.createClient)({
        url: REDIS_URL,
        socket: {
            tls: true,
            rejectUnauthorized: false, // 🔥 Adiciona suporte para certificado autoassinado
        },
    });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    // Aplica o adapter
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    console.log('[Socket.io] Redis Adapter configurado!');
    // Evento principal de conexão
    io.on('connection', (socket) => {
        console.log('Socket conectado:', socket.id);
        // Registra todos os handlers de eventos
        (0, socketHandlers_1.registerSocketHandlers)(io, socket);
    });
    return io;
}
//# sourceMappingURL=index.js.map