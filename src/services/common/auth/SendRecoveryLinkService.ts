import { prismaClient } from '../../../database/prismaClient'
import { Resend } from 'resend'
import { recoveryPasswordTemplate } from '../../../templates/recovery-password'
import dotenv from 'dotenv'

dotenv.config()

interface IPasswordRecoveryRequest {
  email: string
}

class SendRecoveryLinkService {
  async execute({ email }: IPasswordRecoveryRequest) {
    // Verifica se o usuário existe
    const user = await prismaClient.user.findUnique({
      where: { email },
    })

    if (user) {
      // Verifica o número de solicitações nas últimas 60 minutos (1 hora)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

      const requestCount = await prismaClient.recoveryRequests.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      })

      if (requestCount >= 5) {
        throw new Error(
          'Limite de solicitações de recuperação de senha atingido. Tente novamente mais tarde.',
        )
      }

      const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos de validade

      // Invalida solicitações anteriores
      await prismaClient.recoveryRequests.updateMany({
        where: { userId: user.id },
        data: {
          valid: false,
        },
      })

      // Cria uma nova solicitação de recuperação
      const request = await prismaClient.recoveryRequests.create({
        data: {
          userId: user.id,
          expiresAt,
          valid: true,
        },
      })

      // Personaliza o template com o link de recuperação
      const resetLink = `https://incorporae.com.br/recovery-password?requestId=${request.id}`
      const personalizedTemplate = recoveryPasswordTemplate(resetLink)

      // Envia o e-mail via Resend
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Incorporaê! <recovery@incorporae.com.br>',
        to: email,
        subject: 'Recupere sua senha - Incorporaê!',
        html: personalizedTemplate,
      })

      return { message: 'E-mail de recuperação enviado com sucesso.' }
    }

    return { message: 'Usuário não encontrado.' }
  }
}

export { SendRecoveryLinkService }
