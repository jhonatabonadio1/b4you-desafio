"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConvenioController = void 0;
const UpdateConvenioService_1 = require("../services/UpdateConvenioService");
class UpdateConvenioController {
    async handle(request, response) {
        const { titulo, texto, bannerUrl, url, html, categoria } = request.body;
        const { id } = request.params;
        const updateConvenioService = new UpdateConvenioService_1.UpdateConvenioService();
        const convenio = await updateConvenioService.execute({
            id,
            titulo,
            texto,
            bannerUrl,
            url,
            html,
            categoria,
        });
        return response.json(convenio);
    }
}
exports.UpdateConvenioController = UpdateConvenioController;
