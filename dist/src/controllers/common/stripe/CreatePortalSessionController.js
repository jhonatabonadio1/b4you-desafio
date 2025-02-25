import { CreatePortalSessionService } from '../../../services/common/stripe/CreatePortalSessionService';
class CreatePortalSessionController {
    async handle(request, response) {
        const { userId } = request;
        const createPortalSessionService = new CreatePortalSessionService();
        try {
            const session = await createPortalSessionService.execute({
                userId,
            });
            return response.status(200).json(session);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { CreatePortalSessionController };
//# sourceMappingURL=CreatePortalSessionController.js.map