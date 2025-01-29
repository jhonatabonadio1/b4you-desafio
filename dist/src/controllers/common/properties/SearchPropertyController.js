"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPropertyController = void 0;
const SearchPropertyService_1 = require("../../../services/common/properties/SearchPropertyService");
class SearchPropertyController {
    async handle(request, response) {
        const { clientCode } = request.query;
        const searchPropertyService = new SearchPropertyService_1.SearchPropertyService();
        try {
            const property = await searchPropertyService.execute(clientCode);
            return response.status(200).json(property);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SearchPropertyController = SearchPropertyController;
