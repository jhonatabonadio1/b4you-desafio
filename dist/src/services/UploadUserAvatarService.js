"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadUserAvatarService = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path")); // Para trabalhar com a extensão do arquivo
const prismaClient_1 = require("../database/prismaClient");
const uuid_1 = require("uuid");
class UploadUserAvatarService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async execute(userId, filePath, fileName) {
        if (!userId) {
            throw new Error('ID do usuário não fornecido.');
        }
        const fileContent = fs_1.default.readFileSync(filePath);
        // Extrair a extensão do arquivo original
        const fileExtension = path_1.default.extname(fileName).toLowerCase(); // Exemplo: .jpg, .png
        // Verificar se a extensão está correta e se é uma extensão de imagem válida
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        if (!validExtensions.includes(fileExtension)) {
            throw new Error('Formato de arquivo inválido. Use uma imagem no formato JPG, PNG ou GIF.');
        }
        // Gerar um novo nome de arquivo com a extensão correta
        const newFileName = `${(0, uuid_1.v4)()}${fileExtension}`; // Gera um UUID com a extensão do arquivo original
        // Configurações para upload no S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, // Nome do bucket no S3
            Key: `avatars/${userId}/${newFileName}`, // Nome do arquivo no S3, agora com a extensão
            Body: fileContent, // Conteúdo do arquivo
            ACL: 'public-read', // Torna o avatar publicamente acessível
            ContentType: `image/${fileExtension.replace('.', '')}`, // Define o tipo de conteúdo corretamente
        };
        // Faz upload para o S3
        const s3Response = await this.s3.upload(params).promise();
        // Remove o arquivo temporário do servidor após o upload
        fs_1.default.unlinkSync(filePath);
        // Atualiza o link do avatar do usuário no banco de dados
        const user = await prismaClient_1.prismaClient.usuario.update({
            where: { id: userId }, // Certifique-se de que o `userId` está corretamente definido
            data: { avatarUrl: s3Response.Location }, // URL gerada pelo S3
        });
        return user; // Retorna o usuário atualizado com a URL do avatar
    }
}
exports.UploadUserAvatarService = UploadUserAvatarService;
