"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFileService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = require("../../../database/prismaClient");
dotenv_1.default.config();
class GetFileService {
    async execute(documentId) {
        if (!documentId) {
            throw new Error('O ID do documento é obrigatório.');
        }
        // 🔹 Busca o documento no banco de dados
        const document = await prismaClient_1.prismaClient.document.findUnique({
            where: { id: documentId },
        });
        if (!document) {
            throw new Error('Documento não encontrado ou sem permissão.');
        }
        // 🔹 URL via CloudFront (sem assinatura)
        const fileKey = `${document.s3Key}`;
        const fileUrl = `${process.env.CLOUDFRONT_URL}/${fileKey}`;
        return {
            title: document.title,
            url: fileUrl, // 🔥 Link temporário seguro via CloudFront
        };
    }
}
exports.GetFileService = GetFileService;
