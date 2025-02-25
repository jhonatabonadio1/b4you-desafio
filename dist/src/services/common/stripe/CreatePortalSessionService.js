/* eslint-disable camelcase */
import { prismaClient } from '../../../database/prismaClient';
import { stripe } from '../../../lib/stripe';
class CreatePortalSessionService {
    async execute({ userId }) {
        const buscaUsuario = await prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!buscaUsuario) {
            throw new Error('Usuário não encontrado.');
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: buscaUsuario.stripeCustomerId, // ID salvo no seu banco
            return_url: 'https://incorporae.com.br/documents',
            locale: 'pt-BR',
        });
        return session.url;
    }
}
export { CreatePortalSessionService };
//# sourceMappingURL=CreatePortalSessionService.js.map