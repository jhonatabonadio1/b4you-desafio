import { FetchUserDataService } from '../../../services/common/users/FetchUserDataService';
class FetchUserDataController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        try {
            const fetchUserDataService = new FetchUserDataService();
            const user = await fetchUserDataService.execute(userId);
            return response.status(200).json(user);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { FetchUserDataController };
//# sourceMappingURL=FetchUserDataController.js.map