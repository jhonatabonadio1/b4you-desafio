import { Worker } from 'bullmq'
import { redisConnection } from '../config/redis'
import { UploadFileService } from '../services/common/files/UploadFileService'

export const uploadWorker = new Worker(
  'pdf-upload-queue',
  async (job) => {
    const { fileBuffer, originalName, userId, fileId } = job.data
    console.log(`🟢 Processando job de upload: ${job.id}`)

    try {
      const uploadService = new UploadFileService()

      const document = await uploadService.execute(
        fileBuffer,
        originalName,
        userId,
        fileId,
      )

      console.log(`✅ Upload concluído: s3Key=${document.s3Key}`)

      // Retorna o Document criado. O BullMQ vai armazenar isso no `job.returnvalue`
      return document
    } catch (error) {
      console.error(`❌ Erro no job de upload (${job.id}):`, error)
      throw error
    }
  },
  {
    ...redisConnection,
    concurrency: 10,
  },
)

uploadWorker.on('completed', (job, result) => {
  console.log(`Job ${job.id} finalizado! Document ID:`, result.id)
})
