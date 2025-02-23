/* eslint-disable camelcase */
import { Plan } from '@prisma/client'
import { prismaClient } from '../../../database/prismaClient'
import { stripe } from '../../../lib/stripe'
import { defaultApplicationRules } from '../../../config/DefaultApplicationRules'

class FetchPlansService {
  async execute() {
    const buscaPlanos = await prismaClient.plan.findMany({
      where: { active: true },
    })

    if (!buscaPlanos) {
      throw new Error('Nenhum plano encontrado')
    }

    interface Plans extends Plan {
      monthlyPrice: number
      annualPrice: number
    }

    const defaultPlan = {
      id: 'DEFAULT',
      order: 0,
      active: true,
      description:
        'Plano gratuito para quem precisa apenas de uma solução básica.',
      annualPriceId: '',
      monthlyPriceId: '',
      uploadFiles: defaultApplicationRules.documents.uploadFiles,
      maxSize: defaultApplicationRules.documents.maxSize,
      limit: defaultApplicationRules.storage.limit,
      fileSessions: defaultApplicationRules.sessions.maxSessionsPerFile,
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
    } as Plans

    const plans = [defaultPlan] as Plans[]

    for (const plano of buscaPlanos) {
      const monthlyPrice = await stripe.prices.retrieve(plano.monthlyPriceId)
      const annualPrice = await stripe.prices.retrieve(plano.annualPriceId)

      plans.push({
        ...plano,
        monthlyPrice: monthlyPrice.unit_amount ?? 0,
        annualPrice: annualPrice.unit_amount ?? 0,
      })
    }

    return plans
  }
}

export { FetchPlansService }
