"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchTiposController = void 0;
const FetchTiposService_1 = require("../../../services/admin/tipos/FetchTiposService");
class FetchTiposController {
    async handle(request, response) {
        try {
            const fetchTiposService = new FetchTiposService_1.FetchTiposService();
            const tipos = await fetchTiposService.execute();
            return response.status(200).json(tipos);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchTiposController = FetchTiposController;
