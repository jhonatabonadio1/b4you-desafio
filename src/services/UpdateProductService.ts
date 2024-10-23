import { S3 } from 'aws-sdk'
import fs from 'fs'
import { prismaClient } from '../database/prismaClient'

interface IRequest {
  id: string
  nome?: string
  fileName?: string
  filePath?: string
  prestadores?: string[]
  datasDisponiveis?: string[]
  preco?: number
  precoCarroGrande?: number
  precoCarroPequeno?: number
  ativo?: boolean
  diaResetLimite?: number
  opcoesAdicionais?: {
    id?: string
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
    datasDisponiveis,
    diaResetLimite,
    ativo,
    usoMensal,
    opcoesAdicionais,
    exigeVeiculo,
  }: IRequest) {
    // Verificar se o produto existe
    const productExists = await prismaClient.servico.findFirst({
      where: { id, deleted: false },
      include: { opcoesAdicionais: true }, // Incluindo as opções adicionais existentes
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

    // Atualizar dados do serviço
    const updatedProduct = await prismaClient.servico.update({
      where: { id },
      data: {
        nome,
        imageUrl: bannerUrl || productExists.imageUrl,
        prestadores,
        datasDisponiveis,
        diaResetLimite,
        ativo,
        usoMensal,
        exigeVeiculo,
      },
      include: {
        opcoesAdicionais: true,
      },
    })

    // Obter IDs das opções adicionais existentes no banco
    const existingOpcoesIds = productExists.opcoesAdicionais.map(
      (opcao) => opcao.id,
    )

    // Obter IDs das opções adicionais enviadas no front-end
    const updatedOpcoesIds = opcoesAdicionais?.map((opcao) => opcao.id) || []

    // Remover as opções adicionais que não estão mais presentes
    const opcoesToRemove = existingOpcoesIds.filter(
      (id) => !updatedOpcoesIds.includes(id),
    )

    if (opcoesToRemove.length > 0) {
      await prismaClient.opcaoAdicional.updateMany({
        where: { id: { in: opcoesToRemove } },
        data: { deleted: true },
      })
    }

    // Verificar e atualizar ou criar opções adicionais
    if (opcoesAdicionais && opcoesAdicionais.length > 0) {
      for (const opcao of opcoesAdicionais) {
        if (opcao.id) {
          // Atualizar opções adicionais existentes
          await prismaClient.opcaoAdicional.update({
            where: { id: opcao.id },
            data: {
              nome: opcao.nome,
              usoMensal: opcao.usoMensal,
            },
          })
        } else {
          // Criar novas opções adicionais se não tiver ID
          await prismaClient.opcaoAdicional.create({
            data: {
              servico: {
                connect: {
                  id: updatedProduct.id,
                },
              },
              nome: opcao.nome,
              usoMensal: opcao.usoMensal,
            },
          })
        }
      }
    }

    return updatedProduct
  }
}

export { UpdateProductService }
