"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductService = void 0;
const aws_sdk_1 = require("aws-sdk");
const prismaClient_1 = require("../database/prismaClient");
const fs_1 = __importDefault(require("fs"));
class CreateProductService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async execute({ nome, fileName, filePath, prestadores, diaResetLimite, 
    // preco,
    // precoCarroGrande,
    // precoCarroPequeno,
    ativo, usoMensal, opcoesAdicionais, exigeVeiculo, }) {
        if (!nome) {
            throw new Error('Nome é obrigatório');
        }
        if (prestadores.length === 0) {
            throw new Error('Selecione ao menos 1 prestador');
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
        // const precoCents = preco * 100
        // const precoCarroGrandeCents = precoCarroGrande ? precoCarroGrande * 100 : 0
        // const precoCarroPequenoCents = precoCarroPequeno
        //  ? precoCarroPequeno * 100
        //  : 0
        const opcoesAdicionaisString = JSON.stringify(opcoesAdicionais);
        const product = await prismaClient_1.prismaClient.servico.create({
            data: {
                nome,
                imageUrl: bannerUrl,
                prestadores,
                usoMensal,
                diaResetLimite,
                exigeVeiculo,
                opcoesAdicionais: opcoesAdicionaisString,
                ativo,
                created_at: new Date(),
            },
        });
        return product;
    }
}
exports.CreateProductService = CreateProductService;
