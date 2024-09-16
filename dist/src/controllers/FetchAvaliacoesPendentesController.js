"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAvaliacoesPendentesController = void 0;
const FetchAvaliacoesPendentesService_1 = require("../services/FetchAvaliacoesPendentesService");
class FetchAvaliacoesPendentesController {
    async handle(request, response) {
        const { userId } = request;
        const fetchAvaliacoes = new FetchAvaliacoesPendentesService_1.FetchAvaliacoesPendentesService();
        const avaliacao = await fetchAvaliacoes.execute({
            userId,
        });
        return response.json(avaliacao);
    }
}
exports.FetchAvaliacoesPendentesController = FetchAvaliacoesPendentesController;
