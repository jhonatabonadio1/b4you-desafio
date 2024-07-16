"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPrestadorController = void 0;
const FetchPrestadorService_1 = require("../services/FetchPrestadorService");
class FetchPrestadorController {
    async handle(request, response) {
        const { prestadorId } = request.params;
        const updatePrestadorService = new FetchPrestadorService_1.FetchPrestadorService();
        const user = await updatePrestadorService.execute({
            prestadorId,
        });
        return response.json(user);
    }
}
exports.FetchPrestadorController = FetchPrestadorController;
