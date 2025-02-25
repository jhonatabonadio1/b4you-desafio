import { FetchUserStorageService } from '../../../services/common/storage/FetchUserStorageService';
class FetchUserStorageController {
    async handle(request, response) {
        const fetchUserStorage = new FetchUserStorageService();
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
export { FetchUserStorageController };
//# sourceMappingURL=FetchUserStorageController.js.map