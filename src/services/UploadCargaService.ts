import { S3 } from 'aws-sdk'
import fs from 'fs'
import { prismaClient } from '../database/prismaClient'

class UploadCargaService {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  }

  async execute(filePath: string, fileName: string) {
    const fileContent = fs.readFileSync(filePath)

    // Configurações para upload no S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!, // Bucket name from environment variables
      Key: `uploads/${fileName}`, // Nome do arquivo no S3
      Body: fileContent, // Conteúdo do arquivo
    }

    // Faz upload para o S3
    const s3Response = await this.s3.upload(params).promise()

    // Verifica o tamanho do arquivo
    const fileSizeInBytes = fs.statSync(filePath).size

    const cargasCount = await prismaClient.carga.count({
      where: { deleted: false },
    })

    // Se houver mais de 2 cargas, marca a última como "deleted"
    if (cargasCount >= 3) {
      const lastCarga = await prismaClient.carga.findFirst({
        where: {
          deleted: false,
        },
        orderBy: {
          created_at: 'asc', // Ordena pela mais antiga
        },
      })

      if (lastCarga) {
        // Atualiza o status da última carga para "deleted"
        await prismaClient.carga.update({
          where: { id: lastCarga.id },
          data: { deleted: true },
        })
      }
    }

    // Salva no MongoDB usando Prisma
    const carga = await prismaClient.carga.create({
      data: {
        link: s3Response.Location, // URL gerada pelo S3
        size: fileSizeInBytes, // Tamanho em MB
        name: fileName, // Nome original do arquivo
      },
    })

    // Remove o arquivo temporário do servidor
    fs.unlinkSync(filePath)

    return carga
  }
}

export { UploadCargaService }
