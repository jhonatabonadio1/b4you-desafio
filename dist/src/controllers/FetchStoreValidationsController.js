"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStoreValidationsController = void 0;
const FetchStoreValidationsService_1 = require("../services/FetchStoreValidationsService");
class FetchStoreValidationsController {
    async handle(request, response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { userId } = request;
        const validationsService = new FetchStoreValidationsService_1.FetchStoreValidationsService();
        const agendamento = await validationsService.execute({
            storeId: userId,
        });
        return response.json(agendamento);
    }
}
exports.FetchStoreValidationsController = FetchStoreValidationsController;
