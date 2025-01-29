"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadImagesService = void 0;
const jszip_1 = __importDefault(require("jszip"));
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
class DownloadImagesService {
    // Função para extrair a chave S3 da URL
    extractS3Key(imageUrl) {
        try {
            const url = new URL(imageUrl);
            return decodeURIComponent(url.pathname.substring(1)); // Remove o '/' inicial e decodifica
        }
        catch (error) {
            console.error('Erro ao extrair chave do S3:', error);
            return null;
        }
    }
    // Função para baixar imagens do S3 e adicionar ao ZIP
    async downloadAndZipImages(images, imovelCode) {
        if (!images || images.length === 0) {
            throw new Error('Nenhuma imagem disponível para download.');
        }
        const zip = new jszip_1.default();
        const imagePromises = images.map(async (imageUrl, index) => {
            const s3Key = this.extractS3Key(imageUrl);
            if (!s3Key) {
                console.error(`Chave S3 inválida para URL: ${imageUrl}`);
                return;
            }
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Key,
            };
            const data = await s3.getObject(params).promise();
            if (data.Body) {
                zip.file(`${imovelCode}_${index + 1}.jpg`, data.Body); // Adiciona a imagem ao ZIP
            }
        });
        await Promise.all(imagePromises);
        // Gera o conteúdo do ZIP
        return zip.generateAsync({ type: 'nodebuffer' });
    }
}
exports.DownloadImagesService = DownloadImagesService;
