"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConvenioController = void 0;
const CreateConvenioService_1 = require("../services/CreateConvenioService");
class CreateConvenioController {
    async handle(request, response) {
        const { titulo, texto, bannerUrl, url, html, categoria } = request.body;
        const createConvenioService = new CreateConvenioService_1.CreateConvenioService();
        const convenio = await createConvenioService.execute({
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
exports.CreateConvenioController = CreateConvenioController;
