import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { prismaClient } from '../../../database/prismaClient'
import sharp from 'sharp'
import dotenv from 'dotenv'

dotenv.config()

interface FetchHeatmapParams {
  docId: string
  page: number
}

class FetchHeatmapService {
  private s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }

  // Função para obter imagem do S3 como buffer
  private async getImageFromS3(bucket: string, key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key })
      const response = await this.s3.send(command)

      if (!response.Body) {
        throw new Error('Erro ao obter imagem do S3: resposta vazia.')
      }

      // Converte diretamente para um Buffer no AWS SDK v3
      const bodyArray = await response.Body.transformToByteArray()
      return Buffer.from(bodyArray)
    } catch (error) {
      console.error(`Erro ao baixar a imagem ${key}:`, error)
      throw error
    }
  }

  // Função para sobrepor imagens
  private async mergeImages(imageBuffers: Buffer[]): Promise<Buffer> {
    let baseImage = sharp(imageBuffers[0])

    for (let i = 1; i < imageBuffers.length; i++) {
      baseImage = baseImage.composite([
        { input: imageBuffers[i], gravity: 'center' },
      ])
    }

    return baseImage.png().toBuffer()
  }

  async execute({ docId, page }: FetchHeatmapParams): Promise<Buffer> {
    if (!docId) {
      throw new Error('docId é obrigatório para buscar o heatmap.')
    }

    const heatmaps = await prismaClient.heatmap.findMany({
      where: { docId, page },
    })

    if (!heatmaps || heatmaps.length === 0) {
      throw new Error('Heatmaps não encontrados.')
    }

    const bucket = process.env.AWS_BUCKET_NAME!
    const imageBuffers: Buffer[] = []

    // Baixa todas as imagens do S3
    for (const heatmap of heatmaps) {
      const key = `heatmaps/${docId}/${heatmap.page}/${heatmap.s3Key}`
      const buffer = await this.getImageFromS3(bucket, key)
      imageBuffers.push(buffer)
    }

    // Mescla as imagens
    return this.mergeImages(imageBuffers)
  }
}

export { FetchHeatmapService }
