"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserDataService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
class FetchUserDataService {
    async execute(userId) {
        if (!userId) {
            logger.error('O ID do usuário é obrigatório.');
            throw new Error('O ID do usuário é obrigatório.');
        }
        const user = await prismaClient_1.prismaClient.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            logger.error('Usuário não encontrado.', { userId });
            throw new Error('Usuário não encontrado.');
        }
        logger.info('Dados do usuário buscados com sucesso.', {
            userId: user.id,
            email: user.email,
        });
        return user;
    }
}
exports.FetchUserDataService = FetchUserDataService;
