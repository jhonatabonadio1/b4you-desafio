import path from 'path'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { defaultApplicationRules } from '../../../config/DefaultApplicationRules'
import { prismaClient } from '../../../database/prismaClient'

dotenv.config()

const prisma = new PrismaClient()

interface Props {
  originalName: string
  sizeInBytes: number
  userId: string
  key: string
}

class CompleteUploadService {
  private async checkUserStorage(
    userId: string,
    fileSize: number,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pdfs: true },
    })

    let userStorageLimit = defaultApplicationRules.storage.limit

    const buscaInscricaoUsuário = await prismaClient.subscription.findFirst({
      where: {
        active: true,
        userId,
        status: 'active',
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        plan: true,
      },
    })

    if (buscaInscricaoUsuário) {
      userStorageLimit = buscaInscricaoUsuário.plan.limit
    }

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const totalStorageUsed = user.pdfs.reduce(
      (sum, doc) => sum + doc.sizeInBytes / 100,
      0,
    )

    return totalStorageUsed + fileSize <= userStorageLimit
  }

  async execute({ originalName, sizeInBytes, userId, key }: Props) {
    let maxFileSize = defaultApplicationRules.documents.maxSize
    let maxFilesCount = defaultApplicationRules.documents.uploadFiles

    const buscaInscricaoUsuário = await prismaClient.subscription.findFirst({
      where: {
        active: true,
        userId,
        status: 'active',
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        plan: true,
      },
    })

    if (buscaInscricaoUsuário) {
      maxFileSize = buscaInscricaoUsuário.plan.maxSize
      maxFilesCount = buscaInscricaoUsuário.plan.uploadFiles
    }

    const findDocumentsUploaded = await prisma.document.count({
      where: {
        user: {
          id: userId,
        },
      },
    })

    if (findDocumentsUploaded >= maxFilesCount) {
      throw new Error(
        'Limite de documentos atingido. Faça o upgrade para continuar.',
      )
    }

    const ext = path.extname(String(originalName)).toLowerCase()

    if (ext !== '.pdf') {
      throw new Error('Apenas arquivos PDF são permitidos')
    }

    if (sizeInBytes / 100 > maxFileSize) {
      throw new Error(
        'O arquivo excede o limite de ' + maxFileSize / 1024 + 'MB',
      )
    }

    const isAllowed = await this.checkUserStorage(userId, sizeInBytes / 100)
    if (!isAllowed) {
      throw new Error(
        'Limite total de armazenamento atingido. Faça upgrade so seu plano para continuar.',
      )
    }
    const document = await prisma.document.create({
      data: {
        title: originalName,
        s3Key: key, // ou só a parte final
        sizeInBytes: Number(sizeInBytes),
        userId: String(userId),
        iframe: '',
      },
    })

    return document
  }
}

export { CompleteUploadService }
