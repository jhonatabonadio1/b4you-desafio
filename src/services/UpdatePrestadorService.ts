import { prismaClient } from '../database/prismaClient'
import { hash } from 'bcryptjs'
import { cpf as validate, cnpj as validadeCnpj } from 'cpf-cnpj-validator'

interface IRequest {
  prestadorId: string
  bairro?: string
  cep?: string
  cidade?: string
  endereco?: string
  estado?: string
  inscricao?: number
  latitude?: number
  longitude?: number
  password?: string
  razaoSocial?: string
  tipoInscricao?: string
  email?: string
}

// Exclude keys from user
function exclude<Prestador, Key extends keyof Prestador>(
  user: Prestador,
  keys: Key[],
): Omit<Prestador, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class UpdatePrestadorService {
  async execute({
    prestadorId,
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
    email,
  }: IRequest) {
    const user = await prismaClient.prestador.findUnique({
      where: { id: prestadorId, deleted: false },
    })

    if (user) {
      if (inscricao) {
        const inscricaoString = inscricao.toString().replace(/\D/g, '')

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

        const verifyDocAlreadyExists = await prismaClient.prestador.findFirst({
          where: {
            inscricao: inscricaoString,
            deleted: false,
            NOT: { id: prestadorId },
          },
        })

        if (verifyDocAlreadyExists) {
          throw new Error('CNPJ já cadastrado no sistema.')
        }
      }

      if (email) {
        const verifyEmailAlreadyExists = await prismaClient.prestador.findFirst(
          {
            where: { email, deleted: false, NOT: { id: prestadorId } },
          },
        )

        if (verifyEmailAlreadyExists) {
          throw new Error('E-mail já cadastrado no sistema.')
        }
      }

      const passwordHash = password ? await hash(password, 8) : user.password
      const inscricaoString = inscricao
        ? inscricao.toString().replace(/\D/g, '')
        : user.inscricao

      const updatePrestadorService = await prismaClient.prestador.update({
        where: { id: prestadorId },
        data: {
          inscricao: inscricaoString,
          bairro: bairro || user.bairro,
          cep: cep || user.cep,
          cidade: cidade || user.cidade,
          endereco: endereco || user.endereco,
          estado: estado || user.estado,
          latitude: latitude || user.latitude,
          longitude: longitude || user.longitude,
          password: passwordHash,
          razaoSocial: razaoSocial || user.razaoSocial,
          tipoInscricao: tipoInscricao || user.tipoInscricao,
          email: email || user.email,
        },
      })

      const userWithoutPassword = exclude(updatePrestadorService, ['password'])

      return userWithoutPassword
    }
  }
}

export { UpdatePrestadorService }
