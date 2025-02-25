"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionService = void 0;
/* eslint-disable camelcase */
const prismaClient_1 = require("../../../database/prismaClient");
const stripe_1 = require("../../../lib/stripe");
class CreateCheckoutSessionService {
    async execute({ priceId, userId, ip }) {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!priceId) {
            throw new Error('ID do preço é obrigatório.');
        }
        const buscaUsuario = await prismaClient_1.prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!buscaUsuario) {
            throw new Error('Usuário não encontrado.');
        }
        const success_url = 'https://incorporae.com.br/success?session_id={CHECKOUT_SESSION_ID}';
        const cancel_url = 'https://incorporae.com.br/canceled?session_id={CHECKOUT_SESSION_ID}';
        const mode = 'subscription';
        const quantity = 1;
        // Verifica se já existe um usuário com o mesmo e-mail
        const createSession = await prismaClient_1.prismaClient.checkoutSession.create({
            data: {
                user: {
                    connect: buscaUsuario,
                },
                priceId,
                mode,
                quantity,
                success_url,
                status: 'created',
                ip,
                cancel_url,
            },
        });
        const session = await stripe_1.stripe.checkout.sessions.create({
            mode,
            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
            success_url,
            cancel_url,
            customer: buscaUsuario.stripeCustomerId,
        });
        if (!session) {
            throw new Error('Não foi possível criar o checkout.');
        }
        await prismaClient_1.prismaClient.checkoutSession.update({
            where: {
                id: createSession.id,
            },
            data: {
                success_url: session.success_url,
                cancel_url: session.cancel_url,
                sessionUrl: session.url,
                checkoutSessionId: session.id,
            },
        });
        return session.url;
    }
}
exports.CreateCheckoutSessionService = CreateCheckoutSessionService;
