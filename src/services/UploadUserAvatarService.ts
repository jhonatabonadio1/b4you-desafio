import { S3 } from 'aws-sdk'
import fs from 'fs'
import path from 'path' // Para trabalhar com a extensão do arquivo
import { prismaClient } from '../database/prismaClient'
import { v4 as uuid } from 'uuid'

class UploadUserAvatarService {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  }

  async execute(userId: string, filePath: string, fileName: string) {
    if (!userId) {
      throw new Error('ID do usuário não fornecido.')
    }

    const fileContent = fs.readFileSync(filePath)

    // Extrair a extensão do arquivo original
    const fileExtension = path.extname(fileName).toLowerCase() // Exemplo: .jpg, .png

    // Verificar se a extensão está correta e se é uma extensão de imagem válida
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    if (!validExtensions.includes(fileExtension)) {
      throw new Error(
        'Formato de arquivo inválido. Use uma imagem no formato JPG, PNG ou GIF.',
      )
    }

    // Gerar um novo nome de arquivo com a extensão correta
    const newFileName = `${uuid()}${fileExtension}` // Gera um UUID com a extensão do arquivo original

    // Configurações para upload no S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!, // Nome do bucket no S3
      Key: `avatars/${userId}/${newFileName}`, // Nome do arquivo no S3, agora com a extensão
      Body: fileContent, // Conteúdo do arquivo
      ACL: 'public-read', // Torna o avatar publicamente acessível
      ContentType: `image/${fileExtension.replace('.', '')}`, // Define o tipo de conteúdo corretamente
    }

    // Faz upload para o S3
    const s3Response = await this.s3.upload(params).promise()

    // Remove o arquivo temporário do servidor após o upload
    fs.unlinkSync(filePath)

    // Atualiza o link do avatar do usuário no banco de dados
    const user = await prismaClient.usuario.update({
      where: { id: userId }, // Certifique-se de que o `userId` está corretamente definido
      data: { avatarUrl: s3Response.Location }, // URL gerada pelo S3
    })

    return user // Retorna o usuário atualizado com a URL do avatar
  }
}

export { UploadUserAvatarService }
