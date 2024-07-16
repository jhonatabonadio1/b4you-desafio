import { prismaClient } from '../database/prismaClient'
import { toDataURL } from 'qrcode'

interface IRequest {
  id: string
  titulo: string
  imageUrl?: string
  texto?: string
  dataDisponibilidade?: Date
  dataLimite?: Date
  usuarios: string[]
  prestadores: string[]
  todosPrestadores: boolean
  todosUsuarios: boolean
  ativo?: boolean
}

class UpdateBrindeService {
  async execute({
    id,
    titulo,
    todosPrestadores,
    imageUrl,
    texto,
    dataDisponibilidade,
    dataLimite,
    todosUsuarios,
    prestadores,
    usuarios,
    ativo = false,
  }: IRequest) {
    if (!id) {
      throw new Error('ID do brinde é obrigatório')
    }

    if (!titulo) {
      throw new Error('Título é obrigatório')
    }

    if (!todosPrestadores && (!prestadores || prestadores.length === 0)) {
      throw new Error('Selecione ao menos 1 prestador')
    }

    if (!todosUsuarios && (!usuarios || usuarios.length === 0)) {
      throw new Error('Selecione ao menos 1 usuário')
    }

    let disponibilidade: Date | null = null

    const hoje = new Date()
    hoje.setUTCHours(6, 0, 0, 0)

    if (ativo) {
      if (dataDisponibilidade) {
        throw new Error(
          'Não pode informar a data de disponibilidade quando ativo for true.',
        )
      }
      disponibilidade = hoje
    } else {
      if (!dataDisponibilidade) {
        throw new Error(
          'Data de disponibilidade é obrigatória quando ativo for false.',
        )
      }
      disponibilidade = new Date(dataDisponibilidade)
      disponibilidade.setUTCHours(6, 0, 0, 0)

      if (disponibilidade < hoje) {
        throw new Error('A data de disponibilidade não pode ser no passado.')
      }
      ativo = disponibilidade <= hoje
    }

    let limite: Date | null = null
    if (dataLimite) {
      limite = new Date(dataLimite)
      limite.setUTCHours(6, 0, 0, 0)
      if (limite < hoje) {
        throw new Error('A data limite não pode ser no passado.')
      }
    }

    if (limite && disponibilidade && disponibilidade > limite) {
      throw new Error(
        'A data limite deve ser maior ou igual à data de disponibilidade.',
      )
    }

    // Garantir que todosUsuarios e todosPrestadores sejam false se houver usuários ou prestadores específicos
    const todosUsuariosFinal =
      usuarios && usuarios.length > 0 ? false : todosUsuarios
    const todosPrestadoresFinal =
      prestadores && prestadores.length > 0 ? false : todosPrestadores

    // Atualiza o brinde no banco de dados
    const brinde = await prismaClient.brinde.update({
      where: { id, deleted: false },
      data: {
        nome: titulo,
        imageUrl,
        data: texto,
        dataDisponibilidade: disponibilidade,
        dataLimite: limite,
        todosUsuarios: todosUsuariosFinal,
        todosPrestadores: todosPrestadoresFinal,
        usuariosEspecificos: todosUsuariosFinal ? [] : usuarios,
        prestadoresEspecificos: todosPrestadoresFinal ? [] : prestadores,
        ativo,
      },
    })

    const qrCodeData = await toDataURL(brinde.id)

    const updatedBrinde = await prismaClient.brinde.update({
      where: { id: brinde.id, deleted: false },
      data: { qrcode: qrCodeData },
    })

    return updatedBrinde
  }
}

export { UpdateBrindeService }
