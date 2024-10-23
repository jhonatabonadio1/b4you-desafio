import { S3 } from 'aws-sdk'
import { prismaClient } from '../database/prismaClient'
import fs from 'fs'

interface IRequest {
  id?: string
  titulo: string
  texto?: string
  url: string
  html?: string
  categoria: string
  filePath?: string
  fileName?: string
  ativo?: string
}

class UpdateConvenioService {
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
    texto,
    url,
    html,
    categoria,
    filePath,
    fileName,
    ativo,
  }: IRequest) {
    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    if (!categoria) {
      throw new Error('Categoria é obrigatória.')
    }

    if (!url) {
      throw new Error('URL de redirecionamento é obrigatório.')
    }

    let bannerUrl = ''

    if (filePath) {
      // Se há um arquivo, faz o upload para o S3
      const fileContent = fs.readFileSync(filePath)

      // Configurações para upload no S3 com ACL public-read
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!, // Nome do bucket
        Key: `uploads/${fileName}`, // Nome do arquivo no S3
        Body: fileContent, // Conteúdo do arquivo
        ACL: 'public-read', // Tornar o arquivo público
      }

      // Faz o upload para o S3 e pega a URL pública
      const s3Response = await this.s3.upload(params).promise()
      bannerUrl = s3Response.Location

      // Remove o arquivo local após o upload
      fs.unlinkSync(filePath)
    }

    // Busca o convênio existente
    const existingConvenio = await prismaClient.convenios.findUnique({
      where: { id },
    })

    if (!existingConvenio) {
      throw new Error('Convênio não encontrado.')
    }

    // Se não houver um novo arquivo, mantém a URL existente
    bannerUrl = bannerUrl || existingConvenio.bannerUrl

    // Atualiza o convênio com os novos dados ou mantém os existentes
    const updatedConvenio = await prismaClient.convenios.update({
      where: { id },
      data: {
        titulo,
        texto,
        bannerUrl,
        url,
        html,
        ativo: ativo === 'true',
        categoria,
      },
    })

    return updatedConvenio
  }
}

export { UpdateConvenioService }
