import { prismaClient } from '../../../database/prismaClient';
import { stripe } from '../../../lib/stripe';
import { defaultApplicationRules } from '../../../config/DefaultApplicationRules';
class FetchPlansAuthService {
    async execute(userId) {
        const buscaPlanos = await prismaClient.plan.findMany({
            where: { active: true },
        });
        if (!buscaPlanos) {
            throw new Error('Nenhum plano encontrado');
        }
        let userPlanId = 'DEFAULT';
        let isAnnual = false;
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
                stripeSubscriptionId: true,
                interval: true,
            },
        });
        if (buscaInscricaoUsuário) {
            userPlanId = buscaInscricaoUsuário.plan.id;
            isAnnual = buscaInscricaoUsuário.interval === 'year';
        }
        const defaultPlan = {
            id: 'DEFAULT',
            order: 0,
            active: true,
            description: 'Plano gratuito para quem precisa apenas de uma solução básica.',
            annualPriceId: '',
            monthlyPriceId: '',
            uploadFiles: defaultApplicationRules.documents.uploadFiles,
            maxSize: defaultApplicationRules.documents.maxSize,
            limit: defaultApplicationRules.storage.limit,
            fileSessions: defaultApplicationRules.sessions.maxSessionsPerFile,
            name: 'Free',
            monthlyPrice: 0,
            annualPrice: 0,
        };
        const plans = [defaultPlan];
        for (const plano of buscaPlanos) {
            const monthlyPrice = await stripe.prices.retrieve(plano.monthlyPriceId);
            const annualPrice = await stripe.prices.retrieve(plano.annualPriceId);
            plans.push({
                ...plano,
                monthlyPrice: monthlyPrice.unit_amount ?? 0,
                annualPrice: annualPrice.unit_amount ?? 0,
            });
        }
        return {
            currentPlan: {
                id: userPlanId,
                isAnnual,
            },
            data: plans,
        };
    }
}
export { FetchPlansAuthService };
//# sourceMappingURL=FetchPlansAuthService.js.map