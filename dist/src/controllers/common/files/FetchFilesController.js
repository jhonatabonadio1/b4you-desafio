"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFilesController = void 0;
const FetchFilesService_1 = require("../../../services/common/files/FetchFilesService");
class FetchFilesController {
    async handle(req, res) {
        const { userId } = req;
        const { search } = req.query;
        const fetchFilesService = new FetchFilesService_1.FetchFilesService();
        try {
            const files = await fetchFilesService.execute(userId, search);
            return res.status(200).json({ success: true, data: files });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.FetchFilesController = FetchFilesController;
//# sourceMappingURL=FetchFilesController.js.map