import { prismaClient } from '../database/prismaClient'

interface IRequest {
  userId: string
  servicoId: string
  horario: string
  prestadorId: string
  semValidade?: boolean
  opcoesAdicionais?: string[]
  veiculoId: string
}

class CreateAdminAgendamentoService {
  async execute({
    userId,
    servicoId,
    horario,
    semValidade,
    prestadorId,
    opcoesAdicionais,
    veiculoId,
  }: IRequest) {
    if (!servicoId || !prestadorId) {
      throw new Error('ID do serviço, ID do prestador  são obrigatórios')
    }

    if (!semValidade && !horario) {
      throw new Error('Horário é obrigatório')
    }

    const horarioDate = horario && new Date(horario)

    const [findUser, findPrestador, findServico] = await Promise.all([
      prismaClient.usuario.findFirst({
        where: { id: userId, deleted: false },
      }),
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

    const verificaHorarioJaReservado = await prismaClient.agendamento.findFirst(
      {
        where: {
          servicoId,
          prestadorId,
          data: horarioDate,
          deleted: false,
          ativo: true,
        },
      },
    )

    if (verificaHorarioJaReservado) {
      throw new Error('Horário já reservado.')
    }

    // const valor = findServico.preco

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

      /** valor =
        buscaVeiculo.categoria === 'grande'
          ? findServico.precoCarroGrande
          : findServico.precoCarroPequeno**/
    }

    if (opcoesAdicionais) {
      for (const id of opcoesAdicionais) {
        const findOpcao = await prismaClient.opcaoAdicional.findFirst({
          where: { id },
        })

        // valor += findOpcao.value

        if (!findOpcao) {
          throw new Error('Opção adicional não encontrada')
        }
      }
    }

    const agendamento = await prismaClient.agendamento.create({
      data: {
        data: horarioDate,
        semValidade,
        ativo: true,
        veiculo: veiculoId ? { connect: { id: veiculoId } } : undefined,
        usuario: { connect: { id: findUser.id } },
        opcoesAdicionais,
        prestador: { connect: { id: prestadorId } },
        servico: { connect: { id: servicoId } },
      },
    })

    return agendamento
  }
}

export { CreateAdminAgendamentoService }
