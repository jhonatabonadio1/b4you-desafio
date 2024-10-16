"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCargaController = void 0;
const FetchCargaService_1 = require("../services/FetchCargaService");
class FetchCargaController {
    async handle(request, response) {
        const fetchCargaService = new FetchCargaService_1.FetchCargaService();
        const carga = await fetchCargaService.execute();
        return response.json(carga);
    }
}
exports.FetchCargaController = FetchCargaController;
