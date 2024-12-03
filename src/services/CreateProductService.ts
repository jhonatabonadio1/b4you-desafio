import { S3 } from 'aws-sdk'
import { prismaClient } from '../database/prismaClient'
import fs from 'fs'

interface IRequest {
  nome: string
  fileName?: string
  filePath?: string
  prestadores: string[]
  preco?: number
  precoCarroGrande?: number
  precoCarroPequeno?: number
  ativo: boolean
  diaResetLimite?: number
  opcoesAdicionais: {
    nome: string
    usoMensal?: number
  }[]
  exigeVeiculo: boolean
  usoMensal?: number
}

class CreateProductService {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  }

  async execute({
    nome,
    fileName,
    filePath,
    prestadores,

    diaResetLimite,
    // preco,
    // precoCarroGrande,
    // precoCarroPequeno,
    ativo,
    usoMensal,
    opcoesAdicionais,
    exigeVeiculo,
  }: IRequest) {
    if (!nome) {
      throw new Error('Nome é obrigatório')
    }

    if (prestadores.length === 0) {
      throw new Error('Selecione ao menos 1 prestador')
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

    // const precoCents = preco * 100
    // const precoCarroGrandeCents = precoCarroGrande ? precoCarroGrande * 100 : 0
    // const precoCarroPequenoCents = precoCarroPequeno
    //  ? precoCarroPequeno * 100
    //  : 0

    const opcoesAdicionaisString = JSON.stringify(opcoesAdicionais)

    const product = await prismaClient.servico.create({
      data: {
        nome,
        imageUrl: bannerUrl,
        prestadores,
        usoMensal,
        diaResetLimite,
        exigeVeiculo,
        opcoesAdicionais: opcoesAdicionaisString,
        ativo,
        created_at: new Date(),
      },
    })

    return product
  }
}

export { CreateProductService }
