/* eslint-disable camelcase */
import { prismaClient } from '../../../database/prismaClient'

interface IStripeWebhookRequest {
  event: any
}

class StripeWebhookService {
  async execute({ event }: IStripeWebhookRequest) {
    switch (event.type) {
      // ✅ Checkout Finalizado
      case 'checkout.session.completed': {
        const session = event.data.object
        const { id: sessionId, customer: stripeCustomerId } = session

        if (!stripeCustomerId) {
          throw new Error('Stripe Customer ID não encontrado')
        }

        const user = await prismaClient.user.findFirst({
          where: { stripeCustomerId },
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        await prismaClient.checkoutSession.updateMany({
          where: { checkoutSessionId: sessionId, userId: user.id },
          data: { status: 'completed' },
        })

        break
      }

      // ✅ Checkout Expirado
      case 'checkout.session.expired': {
        const session = event.data.object

        await prismaClient.checkoutSession.updateMany({
          where: { checkoutSessionId: session.id },
          data: { status: 'expired' },
        })

        break
      }

      // ✅ Pagamento Confirmado
      case 'invoice.paid': {
        const invoice = event.data.object
        const user = await prismaClient.user.findFirst({
          where: { stripeCustomerId: invoice.customer },
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        await prismaClient.payment.create({
          data: {
            stripeInvoiceId: invoice.id,
            stripePaymentIntentId: invoice.payment_intent,
            amount: invoice.amount_paid,
            status: 'paid',
            currency: invoice.currency,
            userId: user.id,
          },
        })

        break
      }

      // ✅ Pagamento Falhou
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const user = await prismaClient.user.findFirst({
          where: { stripeCustomerId: invoice.customer },
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        await prismaClient.payment.create({
          data: {
            stripeInvoiceId: invoice.id,
            stripePaymentIntentId: invoice.payment_intent,
            amount: invoice.amount_due / 100,
            status: 'failed',
            currency: invoice.currency,
            failureReason: invoice.failure_reason ?? 'Desconhecido',
            userId: user.id,
            lastAttemptAt: new Date(),
          },
        })

        break
      }

      // ✅ Nova Assinatura Criada
      case 'customer.subscription.created': {
        const subscription = event.data.object
        const user = await prismaClient.user.findFirst({
          where: { stripeCustomerId: subscription.customer },
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        const priceId = subscription.plan.id
        const prodId = subscription.plan.product

        const buscaPlano = await prismaClient.plan.findFirst({
          where: {
            AND: [
              {
                stripeProductId: prodId,
              },
              {
                OR: [
                  {
                    annualPriceId: priceId,
                  },
                  {
                    monthlyPriceId: priceId,
                  },
                ],
              },
            ],
          },
        })

        if (!buscaPlano) {
          throw new Error('Plano não encontrado')
        }

        // Desativa assinaturas anteriores
        await prismaClient.subscription.updateMany({
          where: { userId: user.id },
          data: { active: false },
        })

        // Cria nova assinatura ativa
        await prismaClient.subscription.create({
          data: {
            planId: buscaPlano.id,
            stripeSubscriptionId: subscription.id,
            userId: user.id,
            status: subscription.status,
            active: true,
            startDate: new Date(subscription.start_date * 1000),
            endDate: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        })

        break
      }

      // ✅ Atualização da Assinatura
      case 'customer.subscription.updated': {
        const subscription = event.data.object

        const user = await prismaClient.user.findFirst({
          where: { stripeCustomerId: subscription.customer },
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        const priceId = subscription.plan.id
        const prodId = subscription.plan.product

        const buscaPlano = await prismaClient.plan.findFirst({
          where: {
            AND: [
              {
                stripeProductId: prodId,
              },
              {
                OR: [
                  {
                    annualPriceId: priceId,
                  },
                  {
                    monthlyPriceId: priceId,
                  },
                ],
              },
            ],
          },
        })

        if (!buscaPlano) {
          throw new Error('Plano não encontrado')
        }

        await prismaClient.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            planId: buscaPlano.id,
            startDate: new Date(subscription.start_date * 1000),
            endDate: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        })

        break
      }

      // ✅ Assinatura Cancelada
      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await prismaClient.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'canceled', active: false },
        })

        break
      }

      default:
        console.warn(`Evento não tratado: ${event.type}`)
    }

    return { received: true }
  }
}

export { StripeWebhookService }
