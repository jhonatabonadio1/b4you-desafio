"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInformativoController = void 0;
const CreateInformativoService_1 = require("../services/CreateInformativoService");
class CreateInformativoController {
    async handle(request, response) {
        const { titulo, texto, bannerUrl, url } = request.body;
        const createInformativoService = new CreateInformativoService_1.CreateInformativoService();
        const informativo = await createInformativoService.execute({
            titulo,
            texto,
            bannerUrl,
            url,
        });
        return response.json(informativo);
    }
}
exports.CreateInformativoController = CreateInformativoController;
