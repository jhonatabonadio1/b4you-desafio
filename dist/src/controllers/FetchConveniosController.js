"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchConveniosController = void 0;
const FetchConveniosService_1 = require("../services/FetchConveniosService");
class FetchConveniosController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchConveniosService = new FetchConveniosService_1.FetchConveniosService();
        const convenio = await fetchConveniosService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(convenio);
    }
}
exports.FetchConveniosController = FetchConveniosController;
