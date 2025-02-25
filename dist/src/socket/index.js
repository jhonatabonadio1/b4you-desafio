import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { registerSocketHandlers } from './socketHandlers';
import dotenv from 'dotenv';
dotenv.config();
// Carregue .env se necessário
// import dotenv from 'dotenv'
// dotenv.config()
export async function createSocketServer(httpServer) {
    // Cria instância do Socket.io
    const io = new Server(httpServer);
    // Conecta ao Redis
    const REDIS_URL = process.env.REDIS_URL;
    const pubClient = createClient({ url: REDIS_URL });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    // Aplica o adapter
    io.adapter(createAdapter(pubClient, subClient));
    console.log('[Socket.io] Redis Adapter configurado!');
    // Evento principal de conexão
    io.on('connection', (socket) => {
        console.log('Socket conectado:', socket.id);
        // Registra todos os handlers de eventos
        registerSocketHandlers(io, socket);
    });
    return io;
}
//# sourceMappingURL=index.js.map