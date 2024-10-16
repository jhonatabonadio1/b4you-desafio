import { prismaClient } from '../database/prismaClient'
import { hash } from 'bcryptjs'
import { cpf as validate } from 'cpf-cnpj-validator'
import { FetchMemberExistsService } from './FetchMemberExistsService'
import * as Yup from 'yup'

interface IRequest {
  nome: string
  matricula: string
  email: string
  cpf: string
  phone: string
  password: string
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

class CreateUserCargaService {
  async execute({
    nome,
    matricula,
    email,
    cpf,
    phone,
    password,
    birth,
  }: IRequest) {
    const carga = new FetchMemberExistsService()
    const verifyMemberExistInCarga = await carga.execute(matricula)

    if (!verifyMemberExistInCarga.Matricula) {
      throw new Error('Matrícula não encontrada')
    }

    // Validações básicas
    if (!matricula) {
      throw new Error('Matrícula inválida.')
    }

    if (!nome) {
      throw new Error('Nome é obrigatório')
    }

    if (!email) {
      throw new Error('E-mail é obrigatório')
    }

    if (!birth) {
      throw new Error('Data de nascimento é obrigatório')
    }

    // Formatar e validar o e-mail
    const formattedEmail = email.trim().toLowerCase()
    const emailSchema = Yup.string().email('E-mail inválido').required()

    try {
      await emailSchema.validate(formattedEmail)
    } catch (error) {
      throw new Error('E-mail inválido')
    }

    // Validar CPF
    const formattedDoc = cpf.replace(/\D/g, '')
    const validateCpf = validate.isValid(formattedDoc, true)

    if (!validateCpf) {
      throw new Error('CPF inválido.')
    }

    // Verificar se já existe o usuário com essa matrícula, CPF ou e-mail
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
        email: formattedEmail, // Usar o e-mail formatado
        deleted: false,
      },
    })

    if (matericulaAlreadyExists || cpfAlreadyExists || emailAlreadyExists) {
      throw new Error('Usuário já cadastrado.')
    }

    // Criptografar senha
    const passwordHash = await hash(password, 8)

    // Ajustar a data de nascimento
    const birthDate = new Date(birth)
    birthDate.setUTCHours(6, 0, 0, 0)

    // Criar o usuário
    const user = await prismaClient.usuario.create({
      data: {
        nome,
        matricula,
        email: formattedEmail, // Salvar o e-mail formatado
        avatarUrl:
          'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg',
        phone,
        cpf: formattedDoc,
        password: passwordHash,
        birth: birthDate,
      },
    })

    // Remover a senha da resposta
    const userWithoutPassword = exclude(user, ['password'])

    return userWithoutPassword
  }
}

export { CreateUserCargaService }
