"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadImovelImagesService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const DownloadImagesService_1 = require("../../../services/common/images/DownloadImagesService");
class DownloadImovelImagesService {
    async execute(imovelCode) {
        if (!imovelCode) {
            throw new Error('O código do imóvel é obrigatório.');
        }
        // Busca o imóvel pelo código
        const imovel = await prismaClient_1.prismaClient.imovels.findFirst({
            where: {
                imovelCode,
            },
        });
        if (!imovel || !imovel.images || imovel.images.length === 0) {
            throw new Error('Imóvel não encontrado ou sem imagens.');
        }
        const downloadImagesService = new DownloadImagesService_1.DownloadImagesService();
        // Usa o serviço de imagens para baixar e zipar as imagens
        return downloadImagesService.downloadAndZipImages(imovel.images, imovelCode);
    }
}
exports.DownloadImovelImagesService = DownloadImovelImagesService;
