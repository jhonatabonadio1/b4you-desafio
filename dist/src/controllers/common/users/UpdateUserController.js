import { UpdateUserService } from '../../../services/common/users/UpdateUserService';
class UpdateUserController {
    async handle(request, response) {
        const { userId } = request;
        const { email, password, firstName, lastName, empresa } = request.body;
        const updateUserService = new UpdateUserService();
        try {
            const result = await updateUserService.execute({
                userId,
                email,
                password,
                firstName,
                lastName,
                empresa,
            });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { UpdateUserController };
//# sourceMappingURL=UpdateUserController.js.map