"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCampaingController = void 0;
const DeleteCampaingService_1 = require("../../../services/common/campaing/DeleteCampaingService");
class DeleteCampaingController {
    async handle(request, response) {
        const { id } = request.params;
        const { userId } = request;
        const deleteCampaingService = new DeleteCampaingService_1.DeleteCampaingService();
        try {
            const campaing = await deleteCampaingService.execute({
                id,
                userId,
            });
            return response.status(201).json(campaing);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteCampaingController = DeleteCampaingController;
