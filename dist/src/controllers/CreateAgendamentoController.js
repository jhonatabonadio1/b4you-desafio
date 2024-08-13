"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAgendamentoController = void 0;
const CreateAgendamentoService_1 = require("../services/CreateAgendamentoService");
class CreateAgendamentoController {
    async handle(request, response) {
        const { userId } = request;
        const { servicoId, horario, prestadorId, veiculoId, opcaoAdicionalId } = request.body;
        const createBrindeService = new CreateAgendamentoService_1.CreateAgendamentoService();
        const brinde = await createBrindeService.execute({
            userId,
            servicoId,
            horario,
            veiculoId,
            prestadorId,
            opcaoAdicionalId,
        });
        return response.json(brinde);
    }
}
exports.CreateAgendamentoController = CreateAgendamentoController;
