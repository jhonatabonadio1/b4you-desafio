"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminAvaliacoesController = void 0;
const FetchAdminAvaliacoesService_1 = require("../services/FetchAdminAvaliacoesService");
class FetchAdminAvaliacoesController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchAdminAvaliacoesService = new FetchAdminAvaliacoesService_1.FetchAdminAvaliacoesService();
        const avaliacoes = await fetchAdminAvaliacoesService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(avaliacoes);
    }
}
exports.FetchAdminAvaliacoesController = FetchAdminAvaliacoesController;
