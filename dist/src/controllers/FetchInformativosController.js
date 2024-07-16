"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchInformativosController = void 0;
const FetchInformativosService_1 = require("../services/FetchInformativosService");
class FetchInformativosController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchInformativosService = new FetchInformativosService_1.FetchInformativosService();
        const informativo = await fetchInformativosService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(informativo);
    }
}
exports.FetchInformativosController = FetchInformativosController;
