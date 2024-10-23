"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConvenioService = void 0;
const aws_sdk_1 = require("aws-sdk");
const prismaClient_1 = require("../database/prismaClient");
const fs_1 = __importDefault(require("fs"));
class UpdateConvenioService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async execute({ id, titulo, texto, url, html, categoria, filePath, fileName, ativo, }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        if (!categoria) {
            throw new Error('Categoria é obrigatória.');
        }
        if (!url) {
            throw new Error('URL de redirecionamento é obrigatório.');
        }
        let bannerUrl = '';
        if (filePath) {
            // Se há um arquivo, faz o upload para o S3
            const fileContent = fs_1.default.readFileSync(filePath);
            // Configurações para upload no S3 com ACL public-read
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME, // Nome do bucket
                Key: `uploads/${fileName}`, // Nome do arquivo no S3
                Body: fileContent, // Conteúdo do arquivo
                ACL: 'public-read', // Tornar o arquivo público
            };
            // Faz o upload para o S3 e pega a URL pública
            const s3Response = await this.s3.upload(params).promise();
            bannerUrl = s3Response.Location;
            // Remove o arquivo local após o upload
            fs_1.default.unlinkSync(filePath);
        }
        // Busca o convênio existente
        const existingConvenio = await prismaClient_1.prismaClient.convenios.findUnique({
            where: { id },
        });
        if (!existingConvenio) {
            throw new Error('Convênio não encontrado.');
        }
        // Se não houver um novo arquivo, mantém a URL existente
        bannerUrl = bannerUrl || existingConvenio.bannerUrl;
        // Atualiza o convênio com os novos dados ou mantém os existentes
        const updatedConvenio = await prismaClient_1.prismaClient.convenios.update({
            where: { id },
            data: {
                titulo,
                texto,
                bannerUrl,
                url,
                html,
                ativo: ativo === 'true',
                categoria,
            },
        });
        return updatedConvenio;
    }
}
exports.UpdateConvenioService = UpdateConvenioService;
