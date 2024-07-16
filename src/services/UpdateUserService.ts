import { prismaClient } from '../database/prismaClient'
import { hash } from 'bcryptjs'
import { cpf as validate } from 'cpf-cnpj-validator'

interface IRequest {
  usuarioId: string
  nome: string
  matricula: string
  email: string
  cpf: string
  phone: string
  password: string
  tipoAcesso: string
  birth: Date
}

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class UpdateUserService {
  async execute({
    usuarioId,
    matricula,
    nome,
    email,
    cpf,
    phone,
    password,
    tipoAcesso,
    birth,
  }: IRequest) {
    const user = await prismaClient.usuario.findUnique({
      where: { id: usuarioId, deleted: false },
    })

    if (user) {
      if (matricula) {
        const verifyMatriculaAlreadyExists =
          await prismaClient.usuario.findFirst({
            where: { matricula, deleted: false, NOT: { id: usuarioId } },
          })

        if (verifyMatriculaAlreadyExists) {
          throw new Error('Matrícula já inserida no sistema.')
        }
      }

      if (cpf) {
        const inscricaoString = cpf.toString().replace(/\D/g, '')

        const validateCpf = validate.isValid(inscricaoString, true)

        if (!validateCpf) {
          throw new Error('CPF inválido.')
        }

        const verifyDocAlreadyExists = await prismaClient.usuario.findFirst({
          where: {
            matricula: inscricaoString,
            deleted: false,
            NOT: { id: usuarioId },
          },
        })

        if (verifyDocAlreadyExists) {
          throw new Error('CPF já cadastrado no sistema.')
        }
      }

      if (email) {
        const verifyEmailAlreadyExists = await prismaClient.usuario.findFirst({
          where: { email, deleted: false, NOT: { id: usuarioId } },
        })

        if (verifyEmailAlreadyExists) {
          throw new Error('E-mail já cadastrado no sistema.')
        }
      }

      const birthDate = new Date(birth)
      birthDate.setUTCHours(6, 0, 0, 0)

      const passwordHash = password ? await hash(password, 8) : user.password
      const inscricaoString = matricula
        ? matricula.toString().replace(/\D/g, '')
        : user.matricula

      const updateUserService = await prismaClient.usuario.update({
        where: { id: usuarioId, deleted: false },
        data: {
          matricula: inscricaoString,
          nome: nome || user.nome,
          email: email || user.email,
          cpf: cpf || user.cpf,
          phone: phone || user.phone,
          birth: birthDate || user.birth,
          tipoAcesso: tipoAcesso || user.tipoAcesso,
          password: passwordHash,
        },
      })

      const userWithoutPassword = exclude(updateUserService, ['password'])

      return userWithoutPassword
    }
  }
}

export { UpdateUserService }
