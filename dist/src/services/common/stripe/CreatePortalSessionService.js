"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePortalSessionService = void 0;
/* eslint-disable camelcase */
const prismaClient_1 = require("../../../database/prismaClient");
const stripe_1 = require("../../../lib/stripe");
class CreatePortalSessionService {
    async execute({ userId }) {
        const buscaUsuario = await prismaClient_1.prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!buscaUsuario) {
            throw new Error('Usuário não encontrado.');
        }
        const session = await stripe_1.stripe.billingPortal.sessions.create({
            customer: buscaUsuario.stripeCustomerId, // ID salvo no seu banco
            return_url: 'https://incorporae.com.br/documents',
            locale: 'pt-BR',
        });
        return session.url;
    }
}
exports.CreatePortalSessionService = CreatePortalSessionService;
