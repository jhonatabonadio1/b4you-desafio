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
            include: { opcoesAdicionais: true }, // Incluindo as opções adicionais existentes
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
            },
            include: {
                opcoesAdicionais: true,
            },
        });
        // Obter IDs das opções adicionais existentes no banco
        const existingOpcoesIds = productExists.opcoesAdicionais.map((opcao) => opcao.id);
        // Obter IDs das opções adicionais enviadas no front-end
        const updatedOpcoesIds = (opcoesAdicionais === null || opcoesAdicionais === void 0 ? void 0 : opcoesAdicionais.map((opcao) => opcao.id)) || [];
        // Remover as opções adicionais que não estão mais presentes
        const opcoesToRemove = existingOpcoesIds.filter((id) => !updatedOpcoesIds.includes(id));
        if (opcoesToRemove.length > 0) {
            await prismaClient_1.prismaClient.opcaoAdicional.updateMany({
                where: { id: { in: opcoesToRemove } },
                data: { deleted: true },
            });
        }
        // Verificar e atualizar ou criar opções adicionais
        if (opcoesAdicionais && opcoesAdicionais.length > 0) {
            for (const opcao of opcoesAdicionais) {
                if (opcao.id) {
                    // Atualizar opções adicionais existentes
                    await prismaClient_1.prismaClient.opcaoAdicional.update({
                        where: { id: opcao.id },
                        data: {
                            nome: opcao.nome,
                            usoMensal: opcao.usoMensal,
                        },
                    });
                }
                else {
                    // Criar novas opções adicionais se não tiver ID
                    await prismaClient_1.prismaClient.opcaoAdicional.create({
                        data: {
                            servico: {
                                connect: {
                                    id: updatedProduct.id,
                                },
                            },
                            nome: opcao.nome,
                            usoMensal: opcao.usoMensal,
                        },
                    });
                }
            }
        }
        return updatedProduct;
    }
}
exports.UpdateProductService = UpdateProductService;
