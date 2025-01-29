"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFonteController = void 0;
const CreateFonteService_1 = require("../../../services/admin/fontes/CreateFonteService");
class CreateFonteController {
    async handle(request, response) {
        const { nome } = request.body;
        try {
            const createFonteService = new CreateFonteService_1.CreateFonteService();
            const fonte = await createFonteService.execute(nome);
            return response.status(201).json(fonte);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateFonteController = CreateFonteController;
