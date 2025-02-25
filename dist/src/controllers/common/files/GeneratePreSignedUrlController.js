"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePreSignedUrlController = void 0;
const GeneratePreSignedUrlService_1 = require("../../../services/common/files/GeneratePreSignedUrlService");
class GeneratePreSignedUrlController {
    // Método para iniciar o upload
    async handle(req, res) {
        try {
            const { userId } = req;
            const { fileName, fileType, sizeInBytes } = req.body;
            if (!fileName || !fileType || !sizeInBytes) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }
            if (!userId) {
                return res.status(400).json({ error: 'Usuário não especificado' });
            }
            const uploadFileService = new GeneratePreSignedUrlService_1.GeneratePreSignedUrlService();
            const uploadFile = await uploadFileService.execute({
                fileName,
                fileType,
                sizeInBytes,
                userId,
            });
            return res.status(200).json(uploadFile);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.GeneratePreSignedUrlController = GeneratePreSignedUrlController;
