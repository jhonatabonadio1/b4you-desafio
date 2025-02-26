"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendRecoveryLinkService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const resend_1 = require("resend");
const recovery_password_1 = require("../../../templates/recovery-password");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SendRecoveryLinkService {
    async execute({ email }) {
        // Verifica se o usuário existe
        const user = await prismaClient_1.prismaClient.user.findUnique({
            where: { email },
        });
        if (user) {
            // Verifica o número de solicitações nas últimas 60 minutos (1 hora)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const requestCount = await prismaClient_1.prismaClient.recoveryRequests.count({
                where: {
                    userId: user.id,
                    createdAt: {
                        gte: oneHourAgo,
                    },
                },
            });
            if (requestCount >= 5) {
                throw new Error('Limite de solicitações de recuperação de senha atingido. Tente novamente mais tarde.');
            }
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos de validade
            // Invalida solicitações anteriores
            await prismaClient_1.prismaClient.recoveryRequests.updateMany({
                where: { userId: user.id },
                data: {
                    valid: false,
                },
            });
            // Cria uma nova solicitação de recuperação
            const request = await prismaClient_1.prismaClient.recoveryRequests.create({
                data: {
                    userId: user.id,
                    expiresAt,
                    valid: true,
                },
            });
            // Personaliza o template com o link de recuperação
            const resetLink = `https://incorporae.com.br/recovery-password?requestId=${request.id}`;
            const personalizedTemplate = (0, recovery_password_1.recoveryPasswordTemplate)(resetLink);
            // Envia o e-mail via Resend
            const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'Incorporaê <recovery@incorporae.com.br>',
                to: email,
                subject: 'Recupere sua senha - Incorporaê',
                html: personalizedTemplate,
            });
            return { message: 'E-mail de recuperação enviado com sucesso.' };
        }
        return { message: 'Usuário não encontrado.' };
    }
}
exports.SendRecoveryLinkService = SendRecoveryLinkService;
