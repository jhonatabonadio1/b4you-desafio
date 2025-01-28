import { prismaClient } from '../../../database/prismaClient'
import AWS from 'aws-sdk'

class DeleteImovelService {
  private s3: AWS.S3

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
  }

  private async deleteFromS3(imageUrl: string) {
    const bucketName = process.env.AWS_BUCKET_NAME as string
    const fileName = imageUrl.split('/').pop() // Extrai o nome do arquivo da URL

    if (!fileName) {
      throw new Error(
        `Nome do arquivo não pôde ser extraído da URL: ${imageUrl}`,
      )
    }

    await this.s3
      .deleteObject({
        Bucket: bucketName,
        Key: fileName,
      })
      .promise()
  }

  async execute(id: string, userId: string) {
    if (!id) {
      throw new Error('O ID do imóvel é obrigatório.')
    }

    const buscaUsuario = await prismaClient.users.findUnique({
      where: { id: userId },
    })

    if (!buscaUsuario) {
      throw new Error('Usuário não encontrado')
    }

    // Busca o imóvel no banco de dados
    const property = await prismaClient.imovels.findUnique({
      where: { id },
    })

    if (!property) {
      throw new Error('Imóvel não encontrado.')
    }

    // Verificar permissões
    if (buscaUsuario.role !== 'admin' && property.user !== userId) {
      throw new Error('Você não tem permissão para excluir este imóvel.')
    }

    // Excluir imagens associadas do S3
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map((imageUrl) =>
        this.deleteFromS3(imageUrl),
      )
      await Promise.all(deletePromises)
    }

    // Excluir o imóvel do banco de dados
    await prismaClient.imovels.delete({
      where: { id },
    })

    return { message: 'Imóvel excluído com sucesso.' }
  }
}

export { DeleteImovelService }
