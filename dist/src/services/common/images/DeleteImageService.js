"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteImageService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class DeleteImageService {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }
    async execute(imageUrl) {
        if (!imageUrl) {
            throw new Error('A URL da imagem é obrigatória.');
        }
        const bucketName = process.env.AWS_BUCKET_NAME;
        const fileName = imageUrl.split('/').pop(); // Obtém o nome do arquivo da URL
        if (!fileName) {
            throw new Error('O nome do arquivo não pôde ser extraído da URL.');
        }
        const deleteParams = {
            Bucket: bucketName,
            Key: fileName,
        };
        try {
            await this.s3.deleteObject(deleteParams).promise();
            return 'Imagem excluída com sucesso.';
        }
        catch (error) {
            console.error('Erro ao excluir a imagem:', error);
            throw new Error('Falha ao excluir a imagem.');
        }
    }
}
exports.DeleteImageService = DeleteImageService;
