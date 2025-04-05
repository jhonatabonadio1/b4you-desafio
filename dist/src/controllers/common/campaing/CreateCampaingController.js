"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCampaingController = void 0;
const CreateCampaingService_1 = require("../../../services/common/campaing/CreateCampaingService");
class CreateCampaingController {
    async handle(request, response) {
        const { nome, orcamento, status } = request.body;
        const { userId } = request;
        const createCampaingService = new CreateCampaingService_1.CreateCampaingService();
        try {
            const campaing = await createCampaingService.execute({
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
exports.CreateCampaingController = CreateCampaingController;
