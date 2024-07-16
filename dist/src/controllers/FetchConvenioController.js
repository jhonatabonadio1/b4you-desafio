"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchConvenioController = void 0;
const FetchConvenioService_1 = require("../services/FetchConvenioService");
class FetchConvenioController {
    async handle(request, response) {
        const { id } = request.params;
        const fetchConvenioService = new FetchConvenioService_1.FetchConvenioService();
        const convenio = await fetchConvenioService.execute({
            id,
        });
        return response.json(convenio);
    }
}
exports.FetchConvenioController = FetchConvenioController;
