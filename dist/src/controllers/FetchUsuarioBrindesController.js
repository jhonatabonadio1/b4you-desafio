"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsuarioBrindesController = void 0;
const FetchUsuarioBrindesService_1 = require("../services/FetchUsuarioBrindesService");
class FetchUsuarioBrindesController {
    async handle(request, response) {
        const { userId } = request;
        const fetchUsersService = new FetchUsuarioBrindesService_1.FetchUsuarioBrindesService();
        const user = await fetchUsersService.execute({
            userId,
        });
        return response.json(user);
    }
}
exports.FetchUsuarioBrindesController = FetchUsuarioBrindesController;
