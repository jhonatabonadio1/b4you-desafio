import { prismaClient } from '../database/prismaClient'

interface IRequest {
  userId: string
  servicoId: string
  horario: string
  prestadorId: string
  opcaoAdicionalId?: string
  veiculoId: string
}

class CreateAgendamentoService {
  async execute({
    userId,
    servicoId,
    horario,
    prestadorId,
    opcaoAdicionalId,
    veiculoId,
  }: IRequest) {
    if (!servicoId || !prestadorId || !horario) {
      throw new Error(
        'ID do serviço, ID do prestador e horário são obrigatórios',
      )
    }

    const [findUser, findPrestador, findServico] = await Promise.all([
      prismaClient.usuario.findFirst({ where: { id: userId, deleted: false } }),
      prismaClient.prestador.findFirst({
        where: { id: prestadorId, deleted: false, ativo: true },
      }),
      prismaClient.servico.findFirst({
        where: { id: servicoId, deleted: false, ativo: true },
      }),
    ])

    if (!findUser) {
      throw new Error('Usuário não encontrado')
    }

    if (!findPrestador) {
      throw new Error('Prestador não encontrado')
    }

    if (!findServico) {
      throw new Error('Serviço não encontrado')
    }

    if (!findServico.datasDisponiveis.includes(horario)) {
      throw new Error('Horário inexistente')
    }

    const verificaHorarioJaReservado = await prismaClient.agendamento.findFirst(
      {
        where: {
          servicoId,
          prestadorId,
          data: horario,
          deleted: false,
          ativo: true,
        },
      },
    )

    if (verificaHorarioJaReservado) {
      throw new Error('Horário já reservado.')
    }

    let valor = findServico.preco

    if (findServico.exigeVeiculo) {
      if (!veiculoId) {
        throw new Error('ID do veículo é obrigatório')
      }

      const buscaVeiculo = await prismaClient.veiculo.findFirst({
        where: { id: veiculoId, deleted: false },
      })

      if (!buscaVeiculo) {
        throw new Error('Veículo não encontrado.')
      }

      valor =
        buscaVeiculo.categoria === 'grande'
          ? findServico.precoCarroGrande
          : findServico.precoCarroPequeno
    }

    if (opcaoAdicionalId) {
      const findOpcao = await prismaClient.opcaoAdicional.findFirst({
        where: { id: opcaoAdicionalId },
      })

      if (!findOpcao) {
        throw new Error('Opção adicional não encontrada')
      }

      valor += findOpcao.value
    }

    const agendamento = await prismaClient.agendamento.create({
      data: {
        data: horario,
        ativo: true,
        valor,
        veiculo: veiculoId ? { connect: { id: veiculoId } } : undefined,
        usuario: { connect: { id: userId } },
        opcaoAdicional: opcaoAdicionalId
          ? { connect: { id: opcaoAdicionalId } }
          : undefined,
        prestador: { connect: { id: prestadorId } },
        servico: { connect: { id: servicoId } },
      },
    })

    return agendamento
  }
}

export { CreateAgendamentoService }
