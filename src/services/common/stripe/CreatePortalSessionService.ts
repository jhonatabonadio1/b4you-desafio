/* eslint-disable camelcase */
import { prismaClient } from '../../../database/prismaClient'
import { stripe } from '../../../lib/stripe'

interface ICreatePortalSessionRequest {
  userId: string
}

class CreatePortalSessionService {
  async execute({ userId }: ICreatePortalSessionRequest) {
    const buscaUsuario = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!buscaUsuario) {
      throw new Error('Usuário não encontrado.')
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: buscaUsuario.stripeCustomerId, // ID salvo no seu banco
      return_url: 'http://localhost:3000/documents',
      locale: 'pt-BR',
    })

    return session.url
  }
}

export { CreatePortalSessionService }
