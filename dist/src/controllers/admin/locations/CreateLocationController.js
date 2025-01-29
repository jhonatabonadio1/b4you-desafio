"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocationController = void 0;
const CreateLocationService_1 = require("../../../services/admin/locations/CreateLocationService");
class CreateLocationController {
    async handle(request, response) {
        const { sigla, cidade } = request.body;
        try {
            const createLocationService = new CreateLocationService_1.CreateLocationService();
            const result = await createLocationService.execute(sigla, cidade);
            return response.status(201).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateLocationController = CreateLocationController;
