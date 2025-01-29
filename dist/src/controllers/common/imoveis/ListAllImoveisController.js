"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllImoveisController = void 0;
const ListAllImoveisService_1 = require("../../../services/common/imoveis/ListAllImoveisService");
class ListAllImoveisController {
    async handle(request, response) {
        const listAllImoveisService = new ListAllImoveisService_1.ListAllImoveisService();
        try {
            const result = await listAllImoveisService.execute();
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }
}
exports.ListAllImoveisController = ListAllImoveisController;
