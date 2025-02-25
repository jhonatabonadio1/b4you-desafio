"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFileService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class DeleteFileService {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    /**
     * Deleta um documento do banco e do S3
     * @param docId - ID do documento
     * @param userId - ID do usuário autenticado
     */
    async execute(docId, userId) {
        // 1. Verificar se o documento existe e pertence ao usuário
        const document = await prisma.document.findUnique({
            where: { id: docId },
        });
        if (!document) {
            throw new Error('Documento não encontrado.');
        }
        if (document.userId !== userId) {
            throw new Error('Você não tem permissão para excluir este documento.');
        }
        // 2. Deletar arquivo do S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `secure_uploads/${document.s3Key}`,
        };
        await this.s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        // Delete dependent records first
        // Agora, deletar o documento principal
        await prisma.document.delete({
            where: { id: docId },
        });
    }
}
exports.DeleteFileService = DeleteFileService;
//# sourceMappingURL=DeleteFileService.js.map