"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookService = void 0;
/* eslint-disable camelcase */
const prismaClient_1 = require("../../../database/prismaClient");
class StripeWebhookService {
    async execute({ event }) {
        var _a;
        switch (event.type) {
            // ✅ Checkout Finalizado
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { id: sessionId, customer: stripeCustomerId } = session;
                if (!stripeCustomerId) {
                    throw new Error('Stripe Customer ID não encontrado');
                }
                const user = await prismaClient_1.prismaClient.user.findFirst({
                    where: { stripeCustomerId },
                });
                if (!user) {
                    throw new Error('Usuário não encontrado');
                }
                await prismaClient_1.prismaClient.checkoutSession.updateMany({
                    where: { checkoutSessionId: sessionId, userId: user.id },
                    data: { status: 'completed' },
                });
                break;
            }
            // ✅ Checkout Expirado
            case 'checkout.session.expired': {
                const session = event.data.object;
                await prismaClient_1.prismaClient.checkoutSession.updateMany({
                    where: { checkoutSessionId: session.id },
                    data: { status: 'expired' },
                });
                break;
            }
            // ✅ Pagamento Confirmado
            case 'invoice.paid': {
                const invoice = event.data.object;
                const user = await prismaClient_1.prismaClient.user.findFirst({
                    where: { stripeCustomerId: invoice.customer },
                });
                if (!user) {
                    throw new Error('Usuário não encontrado');
                }
                await prismaClient_1.prismaClient.payment.create({
                    data: {
                        stripeInvoiceId: invoice.id,
                        stripePaymentIntentId: invoice.payment_intent,
                        amount: invoice.amount_paid,
                        status: 'paid',
                        currency: invoice.currency,
                        userId: user.id,
                    },
                });
                break;
            }
            // ✅ Pagamento Falhou
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const user = await prismaClient_1.prismaClient.user.findFirst({
                    where: { stripeCustomerId: invoice.customer },
                });
                if (!user) {
                    throw new Error('Usuário não encontrado');
                }
                await prismaClient_1.prismaClient.payment.create({
                    data: {
                        stripeInvoiceId: invoice.id,
                        stripePaymentIntentId: invoice.payment_intent,
                        amount: invoice.amount_due / 100,
                        status: 'failed',
                        currency: invoice.currency,
                        failureReason: (_a = invoice.failure_reason) !== null && _a !== void 0 ? _a : 'Desconhecido',
                        userId: user.id,
                        lastAttemptAt: new Date(),
                    },
                });
                break;
            }
            // ✅ Nova Assinatura Criada
            case 'customer.subscription.created': {
                const subscription = event.data.object;
                const user = await prismaClient_1.prismaClient.user.findFirst({
                    where: { stripeCustomerId: subscription.customer },
                });
                if (!user) {
                    throw new Error('Usuário não encontrado');
                }
                const priceId = subscription.plan.id;
                const prodId = subscription.plan.product;
                const buscaPlano = await prismaClient_1.prismaClient.plan.findFirst({
                    where: {
                        AND: [
                            { stripeProductId: prodId },
                            {
                                OR: [{ annualPriceId: priceId }, { monthlyPriceId: priceId }],
                            },
                        ],
                    },
                });
                if (!buscaPlano) {
                    throw new Error('Plano não encontrado');
                }
                // Verifica se a assinatura já existe
                const existingSubscription = await prismaClient_1.prismaClient.subscription.findFirst({
                    where: { stripeSubscriptionId: subscription.id },
                });
                if (!existingSubscription) {
                    // Desativa assinaturas anteriores
                    await prismaClient_1.prismaClient.subscription.updateMany({
                        where: { userId: user.id },
                        data: { active: false },
                    });
                    // Cria nova assinatura apenas se ainda não existir
                    await prismaClient_1.prismaClient.subscription.create({
                        data: {
                            planId: buscaPlano.id,
                            stripeSubscriptionId: subscription.id,
                            userId: user.id,
                            status: subscription.status,
                            active: subscription.status === 'active', // 🔹 Só ativa se for "active"
                            interval: subscription.plan.interval,
                            startDate: new Date(subscription.start_date * 1000),
                            endDate: subscription.current_period_end
                                ? new Date(subscription.current_period_end * 1000)
                                : null,
                        },
                    });
                }
                break;
            }
            // ✅ Atualização da Assinatura
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const user = await prismaClient_1.prismaClient.user.findFirst({
                    where: { stripeCustomerId: subscription.customer },
                });
                if (!user) {
                    throw new Error('Usuário não encontrado');
                }
                const priceId = subscription.plan.id;
                const prodId = subscription.plan.product;
                const buscaPlano = await prismaClient_1.prismaClient.plan.findFirst({
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
                });
                if (!buscaPlano) {
                    throw new Error('Plano não encontrado');
                }
                await prismaClient_1.prismaClient.subscription.upsert({
                    where: { userId: user.id, stripeSubscriptionId: subscription.id },
                    create: {
                        planId: buscaPlano.id,
                        stripeSubscriptionId: subscription.id,
                        userId: user.id,
                        status: subscription.status,
                        active: subscription.status === 'active', // 🔹 Apenas ativa se for "active"
                        interval: subscription.plan.interval,
                        startDate: new Date(subscription.start_date * 1000),
                        endDate: subscription.current_period_end
                            ? new Date(subscription.current_period_end * 1000)
                            : null,
                    },
                    update: {
                        status: subscription.status,
                        active: subscription.status === 'active', // 🔹 Apenas ativa se for "active"
                        planId: buscaPlano.id,
                        startDate: new Date(subscription.start_date * 1000),
                        endDate: subscription.current_period_end
                            ? new Date(subscription.current_period_end * 1000)
                            : null,
                    },
                });
                break;
            }
            // ✅ Assinatura Cancelada
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await prismaClient_1.prismaClient.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { status: 'canceled', active: false },
                });
                break;
            }
            default:
                console.warn(`Evento não tratado: ${event.type}`);
        }
        return { received: true };
    }
}
exports.StripeWebhookService = StripeWebhookService;
