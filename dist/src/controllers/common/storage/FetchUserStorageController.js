"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserStorageController = void 0;
const FetchUserStorageService_1 = require("../../../services/common/storage/FetchUserStorageService");
class FetchUserStorageController {
    async handle(request, response) {
        const fetchUserStorage = new FetchUserStorageService_1.FetchUserStorageService();
        const { userId } = request;
        try {
            const storage = await fetchUserStorage.execute(userId);
            return response.status(200).json(storage);
        }
        catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }
}
exports.FetchUserStorageController = FetchUserStorageController;
//# sourceMappingURL=FetchUserStorageController.js.map