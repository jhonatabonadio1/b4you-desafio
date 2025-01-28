import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { prismaClient } from '../../../database/prismaClient'

interface ISignInRequest {
  email: string
  password: string
}

// Função para excluir chaves sensíveis do usuário
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class SignInService {
  async execute({ email, password }: ISignInRequest) {
    if (!email) {
      throw new Error('E-mail é obrigatório.')
    }

    if (!password) {
      throw new Error('Senha é obrigatória.')
    }

    // Busca o usuário no banco de dados
    const user = await prismaClient.users.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error('E-mail/Senha incorretos.')
    }

    // Compara a senha informada com a senha armazenada
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('E-mail/Senha incorretos.')
    }

    // Geração do token JWT
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '1d',
      },
    )

    // Exclui chaves sensíveis antes de retornar os dados do usuário
    const userWithoutSensitiveKeys = exclude(user, ['password'])

    return {
      token,
      user: userWithoutSensitiveKeys,
    }
  }
}

export { SignInService }
