import { S3 } from 'aws-sdk'
import { prismaClient } from '../database/prismaClient'
import fs from 'fs'

interface IRequest {
  titulo: string
  texto?: string
  url: string
  html?: string
  categoria: string

  filePath?: string
  fileName?: string
}

class CreateConvenioService {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  }

  async execute({
    titulo,
    texto,
    url,
    html,
    categoria,
    filePath,
    fileName,
  }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    if (!categoria) {
      throw new Error('Categoria é obrigatório.')
    }

    if (!url) {
      throw new Error('URL de redirecionamento é obrigatório.')
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

    const convenio = await prismaClient.convenios.create({
      data: {
        titulo,
        texto,
        bannerUrl:
          bannerUrl ||
          'https://pip.global/static/1632e46a5c79d43f3125ca62c54189cb/ba986/hills_placeholder.png',
        url,
        html,
        ativo: true,
        categoria,
      },
    })

    return convenio
  }
}

export { CreateConvenioService }
