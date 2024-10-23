"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConvenioController = void 0;
const UpdateConvenioService_1 = require("../services/UpdateConvenioService");
class UpdateConvenioController {
    async handle(request, response) {
        const { file } = request;
        const { titulo, texto, url, html, categoria, ativo } = request.body;
        const { id } = request.params;
        const updateConvenioService = new UpdateConvenioService_1.UpdateConvenioService();
        const convenio = await updateConvenioService.execute({
            id,
            titulo,
            texto,
            fileName: file === null || file === void 0 ? void 0 : file.filename,
            filePath: file === null || file === void 0 ? void 0 : file.path,
            url,
            html,
            categoria,
            ativo,
        });
        return response.json(convenio);
    }
}
exports.UpdateConvenioController = UpdateConvenioController;
