"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserAgendamentosController = void 0;
const FetchUserAgendamentosService_1 = require("../services/FetchUserAgendamentosService");
class FetchUserAgendamentosController {
    async handle(request, response) {
        const { userId } = request;
        const agendamentoService = new FetchUserAgendamentosService_1.FetchUserAgendamentosService();
        const agendamento = await agendamentoService.execute({
            userId,
        });
        return response.json(agendamento);
    }
}
exports.FetchUserAgendamentosController = FetchUserAgendamentosController;
