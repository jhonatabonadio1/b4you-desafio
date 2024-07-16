"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBrindeController = void 0;
const FetchBrindeService_1 = require("../services/FetchBrindeService");
class FetchBrindeController {
    async handle(request, response) {
        const { id } = request.params;
        const fetchBrindeService = new FetchBrindeService_1.FetchBrindeService();
        const brinde = await fetchBrindeService.execute({
            id,
        });
        return response.json(brinde);
    }
}
exports.FetchBrindeController = FetchBrindeController;
