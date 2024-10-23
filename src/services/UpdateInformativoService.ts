import { S3 } from 'aws-sdk'
import { prismaClient } from '../database/prismaClient'
import fs from 'fs'

interface IRequest {
  id: string
  titulo?: string
  texto?: string
  url?: string
  html?: string

  filePath?: string
  fileName?: string
}

class UpdateInformativoService {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  }

  async execute({
    id,
    titulo,
    html,
    texto,
    url,
    fileName,
    filePath,
  }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    const informativo = await prismaClient.informativos.findFirst({
      where: {
        id,
        deleted: false,
      },
    })

    if (!informativo) {
      throw new Error('Informativo não encontrado')
    }

    let bannerUrl

    if (filePath) {
      const fileContent = fs.readFileSync(filePath)

      // Configurações para upload no S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!, // Bucket name from environment variables
        Key: `uploads/${fileName}`, // Nome do arquivo no S3
        Body: fileContent, // Conteúdo do arquivo
        ACL: 'public-read', // Tornar o arquivo público para leitura
      }

      // Faz upload para o S3
      const s3Response = await this.s3.upload(params).promise()

      bannerUrl = s3Response.Location

      fs.unlinkSync(filePath)
    }

    const updateInformativo = await prismaClient.informativos.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        titulo: titulo || informativo.titulo,
        texto: texto || informativo.texto,
        bannerUrl: bannerUrl || informativo.bannerUrl,
        html: html || informativo.html,
        url: url || informativo.url,
      },
    })

    return updateInformativo
  }
}

export { UpdateInformativoService }
