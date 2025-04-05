"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCampaingController = void 0;
const UpdateCampaingService_1 = require("../../../services/common/campaing/UpdateCampaingService");
class UpdateCampaingController {
    async handle(request, response) {
        const { id } = request.params;
        const { nome, orcamento, status } = request.body;
        const { userId } = request;
        const updateCampaingService = new UpdateCampaingService_1.UpdateCampaingService();
        try {
            const campaing = await updateCampaingService.execute({
                id,
                nome,
                orcamento,
                status,
                userId,
            });
            return response.status(201).json(campaing);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.UpdateCampaingController = UpdateCampaingController;
