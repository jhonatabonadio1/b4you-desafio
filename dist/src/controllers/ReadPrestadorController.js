"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPrestadorController = void 0;
const FetchPrestadorSevice_1 = require("../services/FetchPrestadorSevice");
class FetchPrestadorController {
    async handle(request, response) {
        const { prestadorId } = request.params;
        const updatePrestadorService = new FetchPrestadorSevice_1.FetchPrestadorService();
        const user = await updatePrestadorService.execute({
            prestadorId,
        });
        return response.json(user);
    }
}
exports.FetchPrestadorController = FetchPrestadorController;
