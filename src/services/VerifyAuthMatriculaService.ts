import { prismaClient } from '../database/prismaClient'

interface IAuthenticateRequest {
  matricula: string
  accessType: number
}

class VerifyAuthMatriculaService {
  async execute({ matricula, accessType }: IAuthenticateRequest) {
    if (!matricula) {
      throw new Error('Login é obrigatório.')
    }

    if (!accessType) {
      throw new Error('Tipo de acesso é obrigatório.')
    }

    if (accessType !== 1 && accessType !== 2) {
      throw new Error('Tipo de acesso inválido.')
    }

    if (accessType === 1) {
      const user = await prismaClient.usuario.findFirst({
        where: {
          matricula,
          deleted: false,
        },
      })

      if (!user) {
        throw new Error('Usuário não encontrado.')
      }

      const firstName = user.nome.split(' ')[0]

      const response = {
        nome: firstName,
      }

      return response
    }

    if (accessType === 2) {
      const user = await prismaClient.prestador.findFirst({
        where: {
          inscricao: parseInt(matricula),
          deleted: false,
        },
      })

      if (!user) {
        throw new Error('Usuário não encontrado.')
      }

      const firstName = user.razaoSocial.split(' ')[0]

      const response = {
        nome: firstName,
      }

      return response
    }
  }
}

export { VerifyAuthMatriculaService }
