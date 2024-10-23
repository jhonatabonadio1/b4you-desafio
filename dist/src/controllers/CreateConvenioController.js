"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConvenioController = void 0;
const CreateConvenioService_1 = require("../services/CreateConvenioService");
class CreateConvenioController {
    async handle(request, response) {
        const { file } = request; // Arquivo processado pelo multer
        const { titulo, texto, url, html, categoria } = request.body;
        const createConvenioService = new CreateConvenioService_1.CreateConvenioService();
        const convenio = await createConvenioService.execute({
            titulo,
            texto,
            fileName: file === null || file === void 0 ? void 0 : file.filename,
            filePath: file === null || file === void 0 ? void 0 : file.path,
            url,
            html,
            categoria,
        });
        return response.json(convenio);
    }
}
exports.CreateConvenioController = CreateConvenioController;
