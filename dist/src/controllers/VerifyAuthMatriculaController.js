"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAuthMatriculaController = void 0;
const VerifyAuthMatriculaService_1 = require("../services/VerifyAuthMatriculaService");
class VerifyAuthMatriculaController {
    async handle(request, response) {
        const { login, accessType } = request.body;
        const verifyAuthMatriculaService = new VerifyAuthMatriculaService_1.VerifyAuthMatriculaService();
        const data = await verifyAuthMatriculaService.execute({
            matricula: login,
            accessType,
        });
        return response.json(data);
    }
}
exports.VerifyAuthMatriculaController = VerifyAuthMatriculaController;
