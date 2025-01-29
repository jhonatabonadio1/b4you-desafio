"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTipoController = void 0;
const CreateTipoService_1 = require("../../../services/admin/tipos/CreateTipoService");
class CreateTipoController {
    async handle(request, response) {
        const { nome } = request.body;
        try {
            const createTipoService = new CreateTipoService_1.CreateTipoService();
            const tipo = await createTipoService.execute(nome);
            return response.status(201).json(tipo);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateTipoController = CreateTipoController;
