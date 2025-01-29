"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleClienteFuturoController = void 0;
const ToggleClienteFuturoService_1 = require("../../../services/common/properties/ToggleClienteFuturoService");
class ToggleClienteFuturoController {
    async handle(request, response) {
        const { id } = request.query;
        const addClienteFuturoService = new ToggleClienteFuturoService_1.ToggleClienteFuturoService();
        try {
            const clienteFuturo = await addClienteFuturoService.execute(id);
            return response.status(200).json({ clienteFuturo });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.ToggleClienteFuturoController = ToggleClienteFuturoController;
