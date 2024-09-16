"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStoreAvaliacoesController = void 0;
const FetchStoreAvaliacoesService_1 = require("../services/FetchStoreAvaliacoesService");
class FetchStoreAvaliacoesController {
    async handle(request, response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { userId } = request;
        const agendamentoService = new FetchStoreAvaliacoesService_1.FetchStoreAvaliacoesService();
        const agendamento = await agendamentoService.execute({
            storeId: userId,
        });
        return response.json(agendamento);
    }
}
exports.FetchStoreAvaliacoesController = FetchStoreAvaliacoesController;
