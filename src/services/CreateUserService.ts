import { prismaClient } from '../database/prismaClient'
import { hash } from 'bcryptjs'
import { cpf as validate } from 'cpf-cnpj-validator'

interface IRequest {
  nome: string
  matricula: string
  email: string
  cpf: string
  phone: string
  password: string
  tipoAcesso: string
  birth: Date
}

// Exclude keys from user
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class CreateUserService {
  async execute({
    nome,
    matricula,
    email,
    cpf,
    phone,
    password,
    tipoAcesso,
    birth,
  }: IRequest) {
    if (!matricula) {
      throw new Error('Matrícula inválido.')
    }

    if (!nome) {
      throw new Error('Nome é obrigatório')
    }

    if (!email) {
      throw new Error('E-mail é obrigatório')
    }

    if (!tipoAcesso) {
      throw new Error('Tipo de acesso é obrigatório')
    }

    if (!birth) {
      throw new Error('Data de nascimento é obrigatório')
    }

    const formattedDoc = cpf.replace(/\D/g, '')

    const validateCpf = validate.isValid(formattedDoc, true)

    if (!validateCpf) {
      throw new Error('CPF inválido.')
    }

    const matericulaAlreadyExists = await prismaClient.usuario.findFirst({
      where: {
        matricula,
        deleted: false,
      },
    })

    const cpfAlreadyExists = await prismaClient.usuario.findFirst({
      where: {
        cpf: formattedDoc,
        deleted: false,
      },
    })

    const emailAlreadyExists = await prismaClient.usuario.findFirst({
      where: {
        email,
        deleted: false,
      },
    })

    if (matericulaAlreadyExists || cpfAlreadyExists || emailAlreadyExists) {
      throw new Error('Usuário já cadastrado.')
    }

    const passwordHash = await hash(password, 8)

    const birthDate = new Date(birth)
    birthDate.setUTCHours(6, 0, 0, 0)

    const user = await prismaClient.usuario.create({
      data: {
        nome,
        matricula,
        email,
        phone,
        cpf: formattedDoc,
        password: passwordHash,
        tipoAcesso,
        birth: birthDate,
      },
    })

    const userWithoutPassword = exclude(user, ['password'])

    return userWithoutPassword
  }
}

export { CreateUserService }
