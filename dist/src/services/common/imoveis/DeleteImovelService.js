"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteImovelService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class DeleteImovelService {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }
    async deleteFromS3(imageUrl) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const fileName = imageUrl.split('/').pop(); // Extrai o nome do arquivo da URL
        if (!fileName) {
            throw new Error(`Nome do arquivo não pôde ser extraído da URL: ${imageUrl}`);
        }
        await this.s3
            .deleteObject({
            Bucket: bucketName,
            Key: fileName,
        })
            .promise();
    }
    async execute(id, userId) {
        if (!id) {
            throw new Error('O ID do imóvel é obrigatório.');
        }
        const buscaUsuario = await prismaClient_1.prismaClient.users.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!buscaUsuario) {
            throw new Error('Usuário não encontrado');
        }
        // Busca o imóvel no banco de dados
        const property = await prismaClient_1.prismaClient.imovels.findUnique({
            where: { id },
        });
        if (!property) {
            throw new Error('Imóvel não encontrado.');
        }
        // Verificar permissões
        if (buscaUsuario.role !== 'admin' && property.user !== userId) {
            throw new Error('Você não tem permissão para excluir este imóvel.');
        }
        // Excluir imagens associadas do S3
        if (property.images && property.images.length > 0) {
            const deletePromises = property.images.map((imageUrl) => this.deleteFromS3(imageUrl));
            await Promise.all(deletePromises);
        }
        // Excluir o imóvel do banco de dados
        await prismaClient_1.prismaClient.imovels.delete({
            where: { id },
        });
        return { message: 'Imóvel excluído com sucesso.' };
    }
}
exports.DeleteImovelService = DeleteImovelService;
