"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminController = void 0;
const FetchAdminService_1 = require("../services/FetchAdminService");
class FetchAdminController {
    async handle(request, response) {
        const { userId } = request;
        const fetchAdminService = new FetchAdminService_1.FetchAdminService();
        const token = await fetchAdminService.execute({
            userId,
        });
        return response.json(token);
    }
}
exports.FetchAdminController = FetchAdminController;
