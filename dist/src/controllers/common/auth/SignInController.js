"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInController = void 0;
const SignInService_1 = require("../../../services/common/auth/SignInService");
const prismaClient_1 = require("../../../database/prismaClient");
class SignInController {
    async handle(request, response) {
        const { email, password } = request.body;
        const signInService = new SignInService_1.SignInService();
        const verificaEmailBlacklist = await prismaClient_1.prismaClient.blacklist.findFirst({
            where: { email },
        });
        if (verificaEmailBlacklist) {
            return response
                .status(401)
                .json({ error: 'Usuário bloqueado no sistema.' });
        }
        try {
            const result = await signInService.execute({ email, password });
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SignInController = SignInController;
//# sourceMappingURL=SignInController.js.map