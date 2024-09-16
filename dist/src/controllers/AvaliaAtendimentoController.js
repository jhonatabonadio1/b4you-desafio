"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliaAtendimentoController = void 0;
const AvaliaAtendimentoService_1 = require("../services/AvaliaAtendimentoService");
class AvaliaAtendimentoController {
    async handle(request, response) {
        const { userId } = request;
        const { id } = request.params;
        const { bomAtendimento, servicoCompleto, mensagem, estrelas } = request.body;
        const avaliaAtendimento = new AvaliaAtendimentoService_1.AvaliaAtendimentoService();
        const avalia = await avaliaAtendimento.execute({
            id,
            userId,
            bomAtendimento,
            servicoCompleto,
            mensagem,
            estrelas,
        });
        return response.json(avalia);
    }
}
exports.AvaliaAtendimentoController = AvaliaAtendimentoController;
