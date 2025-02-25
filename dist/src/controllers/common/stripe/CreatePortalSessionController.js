"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePortalSessionController = void 0;
const CreatePortalSessionService_1 = require("../../../services/common/stripe/CreatePortalSessionService");
class CreatePortalSessionController {
    async handle(request, response) {
        const { userId } = request;
        const createPortalSessionService = new CreatePortalSessionService_1.CreatePortalSessionService();
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
exports.CreatePortalSessionController = CreatePortalSessionController;
