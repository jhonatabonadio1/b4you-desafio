import JSZip from 'jszip'
import { S3 } from 'aws-sdk'

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

class DownloadImagesService {
  // Função para extrair a chave S3 da URL
  private extractS3Key(imageUrl: string): string | null {
    try {
      const url = new URL(imageUrl)
      return decodeURIComponent(url.pathname.substring(1)) // Remove o '/' inicial e decodifica
    } catch (error) {
      console.error('Erro ao extrair chave do S3:', error)
      return null
    }
  }

  // Função para baixar imagens do S3 e adicionar ao ZIP
  async downloadAndZipImages(
    images: string[],
    imovelCode: string,
  ): Promise<Buffer> {
    if (!images || images.length === 0) {
      throw new Error('Nenhuma imagem disponível para download.')
    }

    const zip = new JSZip()

    const imagePromises = images.map(async (imageUrl, index) => {
      const s3Key = this.extractS3Key(imageUrl)
      if (!s3Key) {
        console.error(`Chave S3 inválida para URL: ${imageUrl}`)
        return
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: s3Key,
      }

      const data = await s3.getObject(params).promise()

      if (data.Body) {
        zip.file(`${imovelCode}_${index + 1}.jpg`, data.Body as Buffer) // Adiciona a imagem ao ZIP
      }
    })

    await Promise.all(imagePromises)

    // Gera o conteúdo do ZIP
    return zip.generateAsync({ type: 'nodebuffer' })
  }
}

export { DownloadImagesService }
