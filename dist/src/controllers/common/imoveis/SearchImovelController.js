"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchImovelController = void 0;
const SearchImovelService_1 = require("../../../services/common/imoveis/SearchImovelService");
class SearchImovelController {
    async handle(request, response) {
        const { imovelCode } = request.query;
        const searchImovelService = new SearchImovelService_1.SearchImovelService();
        try {
            const imovel = await searchImovelService.execute(imovelCode);
            return response.status(200).json(imovel);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SearchImovelController = SearchImovelController;
