"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserDataController = void 0;
const FetchUserDataService_1 = require("../../../services/common/users/FetchUserDataService");
class FetchUserDataController {
    async handle(request, response) {
        const { userId } = request;
        try {
            const fetchUserDataService = new FetchUserDataService_1.FetchUserDataService();
            const user = await fetchUserDataService.execute({ userId });
            return response.status(200).json(user);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchUserDataController = FetchUserDataController;
