"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPlansService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
const stripe_1 = require("../../../lib/stripe");
const DefaultApplicationRules_1 = require("../../../config/DefaultApplicationRules");
class FetchPlansService {
    async execute() {
        const buscaPlanos = await prismaClient_1.prismaClient.plan.findMany({
            where: { active: true },
        });
        if (!buscaPlanos) {
            throw new Error('Nenhum plano encontrado');
        }
        const defaultPlan = {
            id: 'DEFAULT',
            order: 0,
            active: true,
            description: 'Plano gratuito para quem precisa apenas de uma solução básica.',
            annualPriceId: '',
            monthlyPriceId: '',
            uploadFiles: DefaultApplicationRules_1.defaultApplicationRules.documents.uploadFiles,
            maxSize: DefaultApplicationRules_1.defaultApplicationRules.documents.maxSize,
            limit: DefaultApplicationRules_1.defaultApplicationRules.storage.limit,
            fileSessions: DefaultApplicationRules_1.defaultApplicationRules.sessions.maxSessionsPerFile,
            name: 'Free',
            monthlyPrice: 0,
            annualPrice: 0,
        };
        const plans = [defaultPlan];
        for (const plano of buscaPlanos) {
            const monthlyPrice = await stripe_1.stripe.prices.retrieve(plano.monthlyPriceId);
            const annualPrice = await stripe_1.stripe.prices.retrieve(plano.annualPriceId);
            plans.push({
                ...plano,
                monthlyPrice: monthlyPrice.unit_amount ?? 0,
                annualPrice: annualPrice.unit_amount ?? 0,
            });
        }
        return plans;
    }
}
exports.FetchPlansService = FetchPlansService;
//# sourceMappingURL=FetchPlansService.js.map