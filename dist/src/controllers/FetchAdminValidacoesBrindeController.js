"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminValidacoesBrindesController = void 0;
const FetchAdminValidacoesBrindesService_1 = require("../services/FetchAdminValidacoesBrindesService");
class FetchAdminValidacoesBrindesController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchAdminValidacoesBrindesService = new FetchAdminValidacoesBrindesService_1.FetchAdminValidacoesBrindesService();
        const validacoesBrindes = await fetchAdminValidacoesBrindesService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(validacoesBrindes);
    }
}
exports.FetchAdminValidacoesBrindesController = FetchAdminValidacoesBrindesController;
