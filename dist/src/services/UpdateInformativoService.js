"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInformativoService = void 0;
const aws_sdk_1 = require("aws-sdk");
const prismaClient_1 = require("../database/prismaClient");
const fs_1 = __importDefault(require("fs"));
class UpdateInformativoService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async execute({ id, titulo, html, texto, url, fileName, filePath, }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        const informativo = await prismaClient_1.prismaClient.informativos.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!informativo) {
            throw new Error('Informativo não encontrado');
        }
        let bannerUrl;
        if (filePath) {
            const fileContent = fs_1.default.readFileSync(filePath);
            // Configurações para upload no S3
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME, // Bucket name from environment variables
                Key: `uploads/${fileName}`, // Nome do arquivo no S3
                Body: fileContent, // Conteúdo do arquivo
                ACL: 'public-read', // Tornar o arquivo público para leitura
            };
            // Faz upload para o S3
            const s3Response = await this.s3.upload(params).promise();
            bannerUrl = s3Response.Location;
            fs_1.default.unlinkSync(filePath);
        }
        const updateInformativo = await prismaClient_1.prismaClient.informativos.update({
            where: {
                id,
                deleted: false,
            },
            data: {
                titulo: titulo || informativo.titulo,
                texto: texto || informativo.texto,
                bannerUrl: bannerUrl || informativo.bannerUrl,
                html: html || informativo.html,
                url: url || informativo.url,
            },
        });
        return updateInformativo;
    }
}
exports.UpdateInformativoService = UpdateInformativoService;
