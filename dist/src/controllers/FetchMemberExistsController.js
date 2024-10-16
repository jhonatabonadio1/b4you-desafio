"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMemberExistsController = void 0;
const FetchMemberExistsService_1 = require("../services/FetchMemberExistsService");
class FetchMemberExistsController {
    async handle(request, response) {
        const { matricula } = request.query;
        const fetchMemberService = new FetchMemberExistsService_1.FetchMemberExistsService();
        try {
            // Chama o serviço para buscar a matrícula
            const member = await fetchMemberService.execute(matricula);
            // Retorna os dados do membro se encontrado
            return response.status(200).json(member);
        }
        catch (error) {
            // Retorna erro caso a matrícula não seja encontrada
            return response.status(404).json({
                error: error.message,
            });
        }
    }
}
exports.FetchMemberExistsController = FetchMemberExistsController;
