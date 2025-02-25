import { CreateUserService } from '../../../services/common/users/CreateUserService';
import { prismaClient } from '../../../database/prismaClient';
class CreateUserController {
    async handle(request, response) {
        const { email, password, firstName, lastName, empresa } = request.body;
        const verificaEmailBlacklist = await prismaClient.blacklist.findFirst({
            where: { OR: [{ email }, { empresa }] },
        });
        if (verificaEmailBlacklist) {
            return response
                .status(401)
                .json({ error: 'Usuário bloqueado no sistema.' });
        }
        const createUserService = new CreateUserService();
        try {
            const user = await createUserService.execute({
                email,
                password,
                firstName,
                lastName,
                empresa,
            });
            return response.status(201).json(user);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { CreateUserController };
//# sourceMappingURL=CreateUserController.js.map