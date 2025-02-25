import { CreateSessionService } from '../../../services/common/sessions/CreateSessionService';
class CreateSessionController {
    async handle(request, response) {
        const { docId } = request.body;
        const createSessionService = new CreateSessionService();
        const { ip } = request;
        const userAgent = request.headers['user-agent'] || 'Unknown-Device';
        try {
            const session = await createSessionService.execute({
                docId,
                fingerprint: userAgent,
                network: ip,
            });
            return response.status(201).json(session);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
export { CreateSessionController };
//# sourceMappingURL=CreateSessionController.js.map