import { FetchFilesService } from '../../../services/common/files/FetchFilesService';
class FetchFilesController {
    async handle(req, res) {
        const { userId } = req;
        const { search } = req.query;
        const fetchFilesService = new FetchFilesService();
        try {
            const files = await fetchFilesService.execute(userId, search);
            return res.status(200).json({ success: true, data: files });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
export { FetchFilesController };
//# sourceMappingURL=FetchFilesController.js.map