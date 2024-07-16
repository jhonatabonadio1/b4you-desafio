"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchInformativoController = void 0;
const FetchInformativoService_1 = require("../services/FetchInformativoService");
class FetchInformativoController {
    async handle(request, response) {
        const { id } = request.params;
        const fetchInformativoService = new FetchInformativoService_1.FetchInformativoService();
        const informativo = await fetchInformativoService.execute({
            id,
        });
        return response.json(informativo);
    }
}
exports.FetchInformativoController = FetchInformativoController;
