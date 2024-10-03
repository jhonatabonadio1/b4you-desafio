import { prismaClient } from '../database/prismaClient'
import {
  startOfMonth,
  endOfMonth,
  setDate,
  addMonths,
  isBefore,
} from 'date-fns'

interface IRequest {
  userId: string
  servicoId: string
  horario: string
  prestadorId: string
  opcoesAdicionais?: string[]
  veiculoId: string
}

class CreateAgendamentoService {
  async execute({
    userId,
    servicoId,
    horario,
    prestadorId,
    opcoesAdicionais,
    veiculoId,
  }: IRequest) {
    if (!servicoId || !prestadorId || !horario) {
      throw new Error(
        'ID do serviço, ID do prestador e horário são obrigatórios',
      )
    }

    const horarioDate = new Date(horario)

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

    const resetLimiteDia = findServico.diaResetLimite

    if (findServico.usoMensal) {
      if (opcoesAdicionais && opcoesAdicionais.length <= 0) {
        // Data de hoje
        const hoje = new Date()
        // Definindo o dia 20 do mês atual
        const diaVinteMesAtual = setDate(hoje, resetLimiteDia || 20)
        // Definindo o dia 20 do próximo mês
        const diaVinteProximoMes = setDate(
          addMonths(hoje, 1),
          resetLimiteDia || 20,
        )

        // Contagem de agendamentos do mês atual (para verificar o uso mensal)
        const contagemAgendamento = await prismaClient.agendamento.count({
          where: {
            usuarioId: userId,
            servicoId: findServico.id,
            deleted: false,
            // Verifica se o agendamento foi feito neste mês
            created_at: {
              gte: startOfMonth(hoje),
              lte: endOfMonth(hoje),
            },
          },
        })

        // Verifica o último agendamento do usuário para o serviço
        const ultimoAgendamento = await prismaClient.agendamento.findFirst({
          where: {
            usuarioId: userId,
            servicoId: findServico.id,
            deleted: false,
          },
          orderBy: {
            created_at: 'desc', // Ordena pela data mais recente
          },
        })

        // Verifica se o número de agendamentos excede o usoMensal
        if (contagemAgendamento >= findServico.usoMensal) {
          if (ultimoAgendamento) {
            const dataUltimoAgendamento = ultimoAgendamento.created_at

            // Se o último agendamento foi antes do dia 20 deste mês
            if (isBefore(dataUltimoAgendamento, diaVinteMesAtual)) {
              if (isBefore(hoje, diaVinteProximoMes)) {
                // O usuário só poderá agendar a partir do dia 20 do próximo mês
                throw new Error('Limite mensal atingido')
              }
            } else {
              // Se o último agendamento foi após o dia 20 deste mês
              if (isBefore(hoje, diaVinteProximoMes)) {
                throw new Error('Limite mensal atingido')
              }
            }
          }
        }
      }
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

        const limiteUsoMensal = findOpcao.usoMensal

        if (limiteUsoMensal) {
          // Data de hoje
          const hoje = new Date()
          // Definindo o dia 20 do mês atual
          const diaVinteMesAtual = setDate(hoje, resetLimiteDia || 20)
          // Definindo o dia 20 do próximo mês
          const diaVinteProximoMes = setDate(
            addMonths(hoje, 1),
            resetLimiteDia || 20,
          )

          // Contagem de agendamentos do mês atual (para verificar o uso mensal)
          const contagemAgendamento = await prismaClient.agendamento.count({
            where: {
              usuarioId: userId,
              servicoId: findServico.id,
              opcoesAdicionais: {
                has: id,
              },
              deleted: false,
              // Verifica se o agendamento foi feito neste mês
              created_at: {
                gte: startOfMonth(hoje),
                lte: endOfMonth(hoje),
              },
            },
          })

          // Verifica o último agendamento do usuário para o serviço
          const ultimoAgendamento = await prismaClient.agendamento.findFirst({
            where: {
              usuarioId: userId,
              servicoId: findServico.id,
              opcoesAdicionais: {
                has: id,
              },
              deleted: false,
            },
            orderBy: {
              created_at: 'desc', // Ordena pela data mais recente
            },
          })

          // Verifica se o número de agendamentos excede o usoMensal
          if (contagemAgendamento >= limiteUsoMensal) {
            if (ultimoAgendamento) {
              const dataUltimoAgendamento = ultimoAgendamento.created_at

              // Se o último agendamento foi antes do dia 20 deste mês
              if (isBefore(dataUltimoAgendamento, diaVinteMesAtual)) {
                if (isBefore(hoje, diaVinteProximoMes)) {
                  // O usuário só poderá agendar a partir do dia 20 do próximo mês
                  throw new Error('Limite mensal atingido')
                }
              } else {
                // Se o último agendamento foi após o dia 20 deste mês
                if (isBefore(hoje, diaVinteProximoMes)) {
                  throw new Error('Limite mensal atingido')
                }
              }
            }
          }
        }
      }
    }

    const agendamento = await prismaClient.agendamento.create({
      data: {
        data: horarioDate,
        ativo: true,
        veiculo: veiculoId ? { connect: { id: veiculoId } } : undefined,
        usuario: { connect: { id: userId } },
        opcoesAdicionais,
        prestador: { connect: { id: prestadorId } },
        servico: { connect: { id: servicoId } },
      },
    })

    return agendamento
  }
}

export { CreateAgendamentoService }
