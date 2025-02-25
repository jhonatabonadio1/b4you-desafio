"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendRecoveryLinkController = void 0;
const SendRecoveryLinkService_1 = require("../../../services/common/auth/SendRecoveryLinkService");
const prismaClient_1 = require("../../../database/prismaClient");
class SendRecoveryLinkController {
    async handle(request, response) {
        const { email } = request.body;
        const sendRecoveryLnk = new SendRecoveryLinkService_1.SendRecoveryLinkService();
        const verificaEmailBlacklist = await prismaClient_1.prismaClient.blacklist.findFirst({
            where: { email },
        });
        if (verificaEmailBlacklist) {
            return response
                .status(401)
                .json({ error: 'Usuário bloqueado no sistema.' });
        }
        try {
            const result = await sendRecoveryLnk.execute({
                email,
            });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SendRecoveryLinkController = SendRecoveryLinkController;
