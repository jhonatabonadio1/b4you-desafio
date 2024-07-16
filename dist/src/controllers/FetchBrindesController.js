"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBrindesController = void 0;
const FetchBrindesService_1 = require("../services/FetchBrindesService");
class FetchBrindesController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchBrindesService = new FetchBrindesService_1.FetchBrindesService();
        const brinde = await fetchBrindesService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(brinde);
    }
}
exports.FetchBrindesController = FetchBrindesController;
