"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteImageController = void 0;
const DeleteImageService_1 = require("../../../services/common/images/DeleteImageService");
class DeleteImageController {
    async handle(request, response) {
        const { imageUrl } = request.body;
        const deleteImageService = new DeleteImageService_1.DeleteImageService();
        try {
            const message = await deleteImageService.execute(imageUrl);
            return response.status(200).json({ message });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.DeleteImageController = DeleteImageController;
