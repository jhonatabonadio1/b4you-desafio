"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminValidacoesController = void 0;
const FetchAdminValidacoesService_1 = require("../services/FetchAdminValidacoesService");
class FetchAdminValidacoesController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchAdminValidacoesService = new FetchAdminValidacoesService_1.FetchAdminValidacoesService();
        const validacoes = await fetchAdminValidacoesService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(validacoes);
    }
}
exports.FetchAdminValidacoesController = FetchAdminValidacoesController;
