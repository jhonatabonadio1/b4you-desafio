"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStoreAgendamentosController = void 0;
const FetchStoreAgendamentosService_1 = require("../services/FetchStoreAgendamentosService");
class FetchStoreAgendamentosController {
    async handle(request, response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { userId } = request;
        const agendamentoService = new FetchStoreAgendamentosService_1.FetchStoreAgendamentosService();
        const agendamento = await agendamentoService.execute({
            storeId: userId,
        });
        return response.json(agendamento);
    }
}
exports.FetchStoreAgendamentosController = FetchStoreAgendamentosController;
