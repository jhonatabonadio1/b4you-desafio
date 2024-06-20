import { prismaClient } from '../database/prismaClient'
import { hash } from 'bcryptjs'
import { cpf as validate, cnpj as validadeCnpj } from 'cpf-cnpj-validator'

interface IRequest {
  bairro: string
  cep: string
  cidade: string
  endereco: string
  estado: string
  inscricao: number
  latitude: number
  longitude: number
  password: string
  razaoSocial: string
  tipoInscricao: string
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

class CreatePrestadorService {
  async execute({
    inscricao,
    bairro,
    cep,
    cidade,
    endereco,
    estado,
    latitude,
    longitude,
    password,
    razaoSocial,
    tipoInscricao,
  }: IRequest) {
    if (!inscricao) {
      throw new Error('Inscrição inválida.')
    }

    if (!razaoSocial) {
      throw new Error('Razão social é obrigatório')
    }

    if (!tipoInscricao) {
      throw new Error('Tipo inscrição é obrigatório')
    }

    if (tipoInscricao !== 'cpf' && tipoInscricao !== 'cnpj') {
      throw new Error('Tipo inscrição inválido')
    }

    const inscricaoString = inscricao.toString()

    if (tipoInscricao === 'cpf') {
      const validateCpf = validate.isValid(inscricaoString, true)

      if (!validateCpf) {
        throw new Error('CPF/CNPJ inválido.')
      }
    }

    if (tipoInscricao === 'cnpj') {
      const validateCpf = validadeCnpj.isValid(inscricaoString, true)

      if (!validateCpf) {
        throw new Error('CPF/CNPJ inválido.')
      }
    }

    const inscricaoAlreadyExists = await prismaClient.prestador.findFirst({
      where: {
        inscricao,
        deleted: false,
      },
    })

    if (inscricaoAlreadyExists) {
      throw new Error('Prestador já cadastrado.')
    }

    const passwordHash = await hash(password, 8)

    const user = await prismaClient.prestador.create({
      data: {
        bairro,
        cep,
        cidade,
        endereco,
        estado,
        inscricao,
        latitude,
        longitude,
        password: passwordHash,
        tipoInscricao,
        razaoSocial,
      },
    })

    const userWithoutPassword = exclude(user, ['password'])

    return userWithoutPassword
  }
}

export { CreatePrestadorService }
