"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOptionController = void 0;
const CreateOptionService_1 = require("../../../services/common/options/CreateOptionService");
class CreateOptionController {
    async handle(request, response) {
        var _a;
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const { id: propertyId } = request.params; // ID da propriedade
        const { link, motivo, enviado } = request.body;
        const createOptionService = new CreateOptionService_1.CreateOptionService();
        const { userId } = request;
        try {
            const result = await createOptionService.execute({
                token,
                propertyId,
                link,
                motivo,
                encaminhado: enviado,
                userId,
            });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.CreateOptionController = CreateOptionController;
