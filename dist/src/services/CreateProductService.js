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
    async execute({ nome, fileName, filePath, prestadores, datasDisponiveis, diaResetLimite, 
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
        if (datasDisponiveis.length === 0) {
            throw new Error('Selecione ao menos 1 data');
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
        const product = await prismaClient_1.prismaClient.servico.create({
            data: {
                nome,
                imageUrl: bannerUrl,
                prestadores,
                usoMensal,
                diaResetLimite,
                datasDisponiveis,
                exigeVeiculo,
                ativo,
                created_at: new Date(),
            },
            include: {
                opcoesAdicionais: true,
            },
        });
        if (opcoesAdicionais.length > 0) {
            for (const opcao of opcoesAdicionais) {
                await prismaClient_1.prismaClient.opcaoAdicional.create({
                    data: {
                        servico: {
                            connect: {
                                id: product.id,
                            },
                        },
                        nome: opcao.nome,
                        usoMensal: opcao.usoMensal,
                    },
                });
            }
        }
        return product;
    }
}
exports.CreateProductService = CreateProductService;
