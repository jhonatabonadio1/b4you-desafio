import { hash } from 'bcryptjs';
import { prismaClient } from '../../../database/prismaClient';
import { stripe } from '../../../lib/stripe';
class CreateUserService {
    async execute({ email, password, firstName, lastName, empresa, }) {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!email || !password || !firstName || !lastName) {
            throw new Error('Preencha os campos obrigatórios.');
        }
        // Verifica se já existe um usuário com o mesmo e-mail
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email,
            },
        });
        if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{8,})/.test(password)) {
            throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um caractere especial.');
        }
        if (existingUser) {
            throw new Error('Usuário já existe.');
        }
        // Hash da senha
        const hashedPassword = await hash(password, 12);
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        const customerName = `${capitalize(firstName)} ${capitalize(lastName)}`;
        const criaUsuarioStripe = await stripe.customers.create({
            name: customerName,
            email,
        });
        if (!criaUsuarioStripe) {
            throw new Error('Não foi possível criar o usuário.');
        }
        // Criação do usuário no banco de dados
        await prismaClient.user.create({
            data: {
                email,
                firstName: capitalize(firstName),
                lastName: capitalize(lastName),
                empresa,
                password: hashedPassword,
                stripeCustomerId: criaUsuarioStripe.id,
            },
        });
        // Retorno de sucesso
        return { message: 'Sua conta foi criada, faça o login.' };
    }
}
export { CreateUserService };
//# sourceMappingURL=CreateUserService.js.map