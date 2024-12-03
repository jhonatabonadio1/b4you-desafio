"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductService = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const prismaClient_1 = require("../database/prismaClient");
class UpdateProductService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async execute({ id, nome, fileName, filePath, prestadores, diaResetLimite, ativo, usoMensal, opcoesAdicionais, exigeVeiculo, }) {
        // Verificar se o produto existe
        const productExists = await prismaClient_1.prismaClient.servico.findFirst({
            where: { id, deleted: false },
        });
        if (!productExists) {
            throw new Error('Serviço não encontrado');
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
        const opcoesAdicionaisJson = JSON.stringify(opcoesAdicionais);
        // Atualizar dados do serviço
        const updatedProduct = await prismaClient_1.prismaClient.servico.update({
            where: { id },
            data: {
                nome,
                imageUrl: bannerUrl || productExists.imageUrl,
                prestadores,
                diaResetLimite,
                ativo,
                usoMensal,
                exigeVeiculo,
                opcoesAdicionais: opcoesAdicionaisJson,
            },
        });
        return updatedProduct;
    }
}
exports.UpdateProductService = UpdateProductService;
