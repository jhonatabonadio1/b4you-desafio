"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCargaService = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const prismaClient_1 = require("../database/prismaClient");
class UploadCargaService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async execute(filePath, fileName) {
        const fileContent = fs_1.default.readFileSync(filePath);
        // Configurações para upload no S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, // Bucket name from environment variables
            Key: `uploads/${fileName}`, // Nome do arquivo no S3
            Body: fileContent, // Conteúdo do arquivo
        };
        // Faz upload para o S3
        const s3Response = await this.s3.upload(params).promise();
        // Verifica o tamanho do arquivo
        const fileSizeInBytes = fs_1.default.statSync(filePath).size;
        const cargasCount = await prismaClient_1.prismaClient.carga.count();
        // Se houver mais de 2 cargas, marca a última como "deleted"
        if (cargasCount >= 3) {
            const lastCarga = await prismaClient_1.prismaClient.carga.findFirst({
                where: {
                    deleted: false,
                },
                orderBy: {
                    created_at: 'asc', // Ordena pela mais antiga
                },
            });
            if (lastCarga) {
                // Atualiza o status da última carga para "deleted"
                await prismaClient_1.prismaClient.carga.update({
                    where: { id: lastCarga.id },
                    data: { deleted: true },
                });
            }
        }
        // Salva no MongoDB usando Prisma
        const carga = await prismaClient_1.prismaClient.carga.create({
            data: {
                link: s3Response.Location, // URL gerada pelo S3
                size: fileSizeInBytes, // Tamanho em MB
                name: fileName, // Nome original do arquivo
            },
        });
        // Remove o arquivo temporário do servidor
        fs_1.default.unlinkSync(filePath);
        return carga;
    }
}
exports.UploadCargaService = UploadCargaService;
