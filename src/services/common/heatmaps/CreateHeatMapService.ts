import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import dotenv from 'dotenv'

import fs from 'fs/promises'
import { prismaClient } from '../../../database/prismaClient'
dotenv.config()

/* eslint-disable no-irregular-whitespace */
interface CreateHeatmapParams {
  docId: string
  files: Express.Multer.File[]
  metadata: string
}

class CreateHeatmapService {
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

  async execute({ docId, files, metadata }: CreateHeatmapParams) {
    const metaData = JSON.parse(metadata) as {
      page: number
      fileName: string
    }[]

    if (!docId) {
      throw new Error('docId é obrigatório.')
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error(
        'É necessário pelo menos uma interação para criar o heatmap.',
      )
    }

    for (const file of files) {
      const buscaPaginaReferenteAoArquivo = metaData.find(
        (item) => item.fileName === file.originalname,
      )
      if (buscaPaginaReferenteAoArquivo) {
        const ext = path.extname(file.originalname).toLowerCase()

        if (ext !== '.png') {
          throw new Error('Carga inválida')
        }

        const fileBuffer = await fs.readFile(file.path)
        const fileName = `${uuidv4()}_${file.originalname}`

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `heatmaps/${docId}/${buscaPaginaReferenteAoArquivo.page}/${fileName}`,
          Body: fileBuffer,
          ContentType: 'image/png',
        }

        await this.s3.send(new PutObjectCommand(uploadParams))

        await prismaClient.heatmap.create({
          data: {
            docId,
            page: buscaPaginaReferenteAoArquivo.page,
            s3Key: fileName,
          },
        })
      }
    }
  }
}

export { CreateHeatmapService }
