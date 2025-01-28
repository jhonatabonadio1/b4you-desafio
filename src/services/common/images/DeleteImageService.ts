import AWS from 'aws-sdk'

class DeleteImageService {
  private s3: AWS.S3

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
  }

  async execute(imageUrl: string): Promise<string> {
    if (!imageUrl) {
      throw new Error('A URL da imagem é obrigatória.')
    }

    const bucketName = process.env.AWS_BUCKET_NAME as string
    const fileName = imageUrl.split('/').pop() // Obtém o nome do arquivo da URL

    if (!fileName) {
      throw new Error('O nome do arquivo não pôde ser extraído da URL.')
    }

    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    }

    try {
      await this.s3.deleteObject(deleteParams).promise()
      return 'Imagem excluída com sucesso.'
    } catch (error) {
      console.error('Erro ao excluir a imagem:', error)
      throw new Error('Falha ao excluir a imagem.')
    }
  }
}

export { DeleteImageService }
