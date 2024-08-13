"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAgendamentosController = void 0;
const FetchAgendamentosService_1 = require("../services/FetchAgendamentosService");
class FetchAgendamentosController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchAgendamentosService = new FetchAgendamentosService_1.FetchAgendamentosService();
        const agendamento = await fetchAgendamentosService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(agendamento);
    }
}
exports.FetchAgendamentosController = FetchAgendamentosController;
