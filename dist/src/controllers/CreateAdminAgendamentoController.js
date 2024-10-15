"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdminAgendamentoController = void 0;
const CreateAdminAgendamentoService_1 = require("../services/CreateAdminAgendamentoService");
class CreateAdminAgendamentoController {
    async handle(request, response) {
        const { userId, servicoId, semValidade, horario, prestadorId, veiculoId, opcoesAdicionais, } = request.body;
        const createBrindeService = new CreateAdminAgendamentoService_1.CreateAdminAgendamentoService();
        const brinde = await createBrindeService.execute({
            userId,
            servicoId,
            semValidade,
            horario,
            veiculoId,
            prestadorId,
            opcoesAdicionais,
        });
        return response.json(brinde);
    }
}
exports.CreateAdminAgendamentoController = CreateAdminAgendamentoController;
