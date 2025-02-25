"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePreSignedUrlService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const DefaultApplicationRules_1 = require("../../../config/DefaultApplicationRules");
const prismaClient_1 = require("../../../database/prismaClient");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class GeneratePreSignedUrlService {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async checkUserStorage(userId, fileSize) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { pdfs: true },
        });
        let userStorageLimit = DefaultApplicationRules_1.defaultApplicationRules.storage.limit;
        const buscaInscricaoUsuário = await prismaClient_1.prismaClient.subscription.findFirst({
            where: {
                active: true,
                userId,
                status: 'active',
                endDate: {
                    gte: new Date(),
                },
            },
            select: {
                plan: true,
            },
        });
        if (buscaInscricaoUsuário) {
            userStorageLimit = buscaInscricaoUsuário.plan.limit;
        }
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const totalStorageUsed = user.pdfs.reduce((sum, doc) => sum + doc.sizeInBytes / 100 / 100, 0);
        return totalStorageUsed + fileSize <= userStorageLimit;
    }
    async execute({ fileName, fileType, sizeInBytes, userId }) {
        let maxFileSize = DefaultApplicationRules_1.defaultApplicationRules.documents.maxSize;
        let maxFilesCount = DefaultApplicationRules_1.defaultApplicationRules.documents.uploadFiles;
        const buscaInscricaoUsuário = await prismaClient_1.prismaClient.subscription.findFirst({
            where: {
                active: true,
                userId,
                status: 'active',
                endDate: {
                    gte: new Date(),
                },
            },
            select: {
                plan: true,
            },
        });
        if (buscaInscricaoUsuário) {
            maxFileSize = buscaInscricaoUsuário.plan.maxSize;
            maxFilesCount = buscaInscricaoUsuário.plan.uploadFiles;
        }
        const findDocumentsUploaded = await prisma.document.count({
            where: {
                user: {
                    id: userId,
                },
            },
        });
        if (findDocumentsUploaded >= maxFilesCount) {
            throw new Error('Limite de documentos atingido. Faça o upgrade para continuar.');
        }
        const randomHex = crypto_1.default.randomBytes(8).toString('hex');
        const ext = path_1.default.extname(String(fileName)).toLowerCase();
        const key = `secure_uploads/${randomHex}_${fileName}`;
        if (ext !== '.pdf') {
            throw new Error('Apenas arquivos PDF são permitidos');
        }
        if (sizeInBytes / 100 / 100 > maxFileSize) {
            throw new Error('O arquivo excede o limite de ' + maxFileSize / 1024 + 'MB');
        }
        const isAllowed = await this.checkUserStorage(userId, sizeInBytes / 100 / 100);
        if (!isAllowed) {
            throw new Error('Limite total de armazenamento atingido. Faça upgrade so seu plano para continuar.');
        }
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: String(fileType),
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: 60 });
        const data = {
            uploadUrl,
            key,
        };
        return data;
    }
}
exports.GeneratePreSignedUrlService = GeneratePreSignedUrlService;
