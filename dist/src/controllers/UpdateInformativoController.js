"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInformativoController = void 0;
const UpdateInformativoService_1 = require("../services/UpdateInformativoService");
class UpdateInformativoController {
    async handle(request, response) {
        const { file } = request;
        const { titulo, texto, url, html } = request.body;
        const { id } = request.params;
        const updateInformativoService = new UpdateInformativoService_1.UpdateInformativoService();
        const informativo = await updateInformativoService.execute({
            id,
            titulo,
            texto,
            fileName: file === null || file === void 0 ? void 0 : file.filename,
            filePath: file === null || file === void 0 ? void 0 : file.path,
            url,
            html,
        });
        return response.json(informativo);
    }
}
exports.UpdateInformativoController = UpdateInformativoController;
