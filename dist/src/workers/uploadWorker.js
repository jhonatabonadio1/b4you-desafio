"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const UploadFileService_1 = require("../services/common/files/UploadFileService");
exports.uploadWorker = new bullmq_1.Worker('pdf-upload-queue', async (job) => {
    const { filePath, originalName, userId, fileId } = job.data;
    console.log(`🟢 Processando job de upload: ${job.id}`);
    try {
        const uploadService = new UploadFileService_1.UploadFileService();
        const document = await uploadService.execute(filePath, originalName, userId, fileId);
        console.log(`✅ Upload concluído: s3Key=${document.s3Key}`);
        // Retorna o Document criado. O BullMQ vai armazenar isso no `job.returnvalue`
        return document;
    }
    catch (error) {
        console.error(`❌ Erro no job de upload (${job.id}):`, error);
        throw error;
    }
}, Object.assign(Object.assign({}, redis_1.redisConnection), { concurrency: 10 }));
exports.uploadWorker.on('completed', (job, result) => {
    console.log(`Job ${job.id} finalizado! Document ID:`, result.id);
});
