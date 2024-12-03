import { S3 } from 'aws-sdk'
import fs from 'fs'
import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  nome?: string
  fileName?: string
  filePath?: string
  prestadores?: string[]
  preco?: number
  precoCarroGrande?: number
  precoCarroPequeno?: number
  ativo?: boolean
  diaResetLimite?: number
  opcoesAdicionais?: {
    nome: string
    usoMensal?: number
  }[]
  exigeVeiculo?: boolean
  usoMensal?: number
}

class UpdateProductService {
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
    nome,
    fileName,
    filePath,
    prestadores,
    diaResetLimite,
    ativo,
    usoMensal,
    opcoesAdicionais,
    exigeVeiculo,
  }: IRequest) {
    // Verificar se o produto existe
    const productExists = await prismaClient.servico.findFirst({
      where: { id, deleted: false },
    })

    if (!productExists) {
      throw new Error('Serviço não encontrado')
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

    const opcoesAdicionaisJson = JSON.stringify(opcoesAdicionais)

    // Atualizar dados do serviço
    const updatedProduct = await prismaClient.servico.update({
      where: { id },
      data: {
        nome,
        imageUrl: bannerUrl || productExists.imageUrl,
        prestadores,

        diaResetLimite,
        ativo,
        usoMensal,
        exigeVeiculo,
        opcoesAdicionais: opcoesAdicionaisJson,
      },
    })

    return updatedProduct
  }
}

export { UpdateProductService }
