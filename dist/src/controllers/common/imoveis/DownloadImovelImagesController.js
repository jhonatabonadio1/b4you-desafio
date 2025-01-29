"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadImovelImagesController = void 0;
const DownloadImovelImagesService_1 = require("../../../services/common/imoveis/DownloadImovelImagesService");
class DownloadImovelImagesController {
    async handle(request, response) {
        const { imovelCode } = request.query;
        const downloadImovelImagesService = new DownloadImovelImagesService_1.DownloadImovelImagesService();
        try {
            if (!imovelCode || typeof imovelCode !== 'string') {
                return response
                    .status(400)
                    .json({ message: 'Código do imóvel inválido.' });
            }
            const zipContent = await downloadImovelImagesService.execute(imovelCode);
            response.setHeader('Content-Type', 'application/zip');
            response.setHeader('Content-Disposition', `attachment; filename=imagens_imovel_${imovelCode}.zip`);
            response.send(zipContent);
        }
        catch (error) {
            response.status(500).json({ error: error.message });
        }
    }
}
exports.DownloadImovelImagesController = DownloadImovelImagesController;
