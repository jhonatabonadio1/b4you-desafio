"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadCampaingController = void 0;
const ReadCampaingService_1 = require("../../../services/common/campaing/ReadCampaingService");
class ReadCampaingController {
    async handle(request, response) {
        const { userId } = request;
        const readCampaingService = new ReadCampaingService_1.ReadCampaingService();
        try {
            const campaing = await readCampaingService.execute({
                userId,
            });
            return response.status(201).json(campaing);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.ReadCampaingController = ReadCampaingController;
