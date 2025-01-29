"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadImageController = void 0;
const UploadImageService_1 = require("../../../services/common/images/UploadImageService");
class UploadImageController {
    async handle(request, response) {
        const { file } = request; // Arquivo processado pelo multer
        if (!file) {
            return response.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
        }
        const uploadImageService = new UploadImageService_1.UploadImageService();
        try {
            const imageUrl = await uploadImageService.optimizeAndUpload(file.path, file.originalname || '');
            return response.status(200).json({ imageUrl });
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({
                message: 'Erro ao fazer upload da imagem',
                error: error.message,
            });
        }
    }
}
exports.UploadImageController = UploadImageController;
