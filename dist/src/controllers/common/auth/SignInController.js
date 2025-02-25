import { SignInService } from '../../../services/common/auth/SignInService';
import { prismaClient } from '../../../database/prismaClient';
class SignInController {
    async handle(request, response) {
        const { email, password } = request.body;
        const signInService = new SignInService();
        const verificaEmailBlacklist = await prismaClient.blacklist.findFirst({
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
export { SignInController };
//# sourceMappingURL=SignInController.js.map