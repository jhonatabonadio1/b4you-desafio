"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFontesController = void 0;
const FetchFontesService_1 = require("../../../services/admin/fontes/FetchFontesService");
class FetchFontesController {
    async handle(request, response) {
        try {
            const fetchFontesService = new FetchFontesService_1.FetchFontesService();
            const fontes = await fetchFontesService.execute();
            return response.status(200).json(fontes);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchFontesController = FetchFontesController;
