"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFileController = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const uploadQueue_1 = require("../../../lib/uploadQueue");
const mongodb_1 = require("mongodb");
class UploadFileController {
    // Método para iniciar o upload
    async handle(req, res) {
        try {
            const { file, userId } = req;
            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }
            if (!userId) {
                // Se não tiver userId, você decide o que fazer
                // Mas vamos apagar o arquivo local
                await promises_1.default.unlink(file.path);
                return res.status(400).json({ error: 'Usuário não especificado' });
            }
            const geraIdDoDocumento = new mongodb_1.ObjectId().toHexString();
            const job = await uploadQueue_1.uploadQueue.add('upload', {
                filePath: file.path,
                originalName: file.originalname,
                fileId: geraIdDoDocumento,
                userId,
            });
            // Respondemos ao cliente com o jobId
            return res.json({
                message: 'Upload em processamento...',
                title: file.originalname,
                id: geraIdDoDocumento,
                jobId: job.id,
            });
        }
        catch (error) {
            console.error('Erro ao iniciar upload:', error);
            return res.status(500).json({ error: 'Erro ao iniciar upload' });
        }
    }
}
exports.UploadFileController = UploadFileController;
