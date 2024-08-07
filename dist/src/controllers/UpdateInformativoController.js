"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInformativoController = void 0;
const UpdateInformativoService_1 = require("../services/UpdateInformativoService");
class UpdateInformativoController {
    async handle(request, response) {
        const { titulo, texto, bannerUrl, url, html } = request.body;
        const { id } = request.params;
        const updateInformativoService = new UpdateInformativoService_1.UpdateInformativoService();
        const informativo = await updateInformativoService.execute({
            id,
            titulo,
            texto,
            bannerUrl,
            url,
            html,
        });
        return response.json(informativo);
    }
}
exports.UpdateInformativoController = UpdateInformativoController;
