"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveEnvioController = void 0;
const SaveEnvioService_1 = require("../../../services/common/envios/SaveEnvioService");
class SaveEnvioController {
    async handle(request, response) {
        const { userId } = request; // Obtido do middleware de autenticação
        const { phoneNumber, imovelId, clientId, message } = request.body;
        try {
            const saveEnvioService = new SaveEnvioService_1.SaveEnvioService();
            const envio = await saveEnvioService.execute({
                phoneNumber,
                imovelId,
                clientId,
                message,
                userId,
            });
            return response
                .status(201)
                .json({ message: 'Envio salvo com sucesso', envio });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SaveEnvioController = SaveEnvioController;
