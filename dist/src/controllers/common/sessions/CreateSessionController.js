"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSessionController = void 0;
const CreateSessionService_1 = require("../../../services/common/sessions/CreateSessionService");
class CreateSessionController {
    async handle(request, response) {
        const { docId } = request.body;
        const createSessionService = new CreateSessionService_1.CreateSessionService();
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
exports.CreateSessionController = CreateSessionController;
//# sourceMappingURL=CreateSessionController.js.map