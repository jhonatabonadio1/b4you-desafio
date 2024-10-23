"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPrestadorHorariosController = void 0;
const FetchPrestadorHorariosService_1 = require("../services/FetchPrestadorHorariosService");
class FetchPrestadorHorariosController {
    async handle(request, response) {
        const { userId } = request;
        const fetchPrestadorHorariosService = new FetchPrestadorHorariosService_1.FetchPrestadorHorariosService();
        const user = await fetchPrestadorHorariosService.execute({
            prestadorId: userId,
        });
        return response.json(user);
    }
}
exports.FetchPrestadorHorariosController = FetchPrestadorHorariosController;
