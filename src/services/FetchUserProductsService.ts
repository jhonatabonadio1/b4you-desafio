import { prismaClient } from '../database/prismaClient'
import { isAfter } from 'date-fns'

class FetchUserProductsService {
  async execute() {
    const findProducts = await prismaClient.servico.findMany({
      where: { ativo: true, deleted: false },
      include: {
        opcoesAdicionais: true,
      },
    })

    const produtosComHorariosDisponiveis = []

    const agora = new Date()

    for (const produto of findProducts) {
      // Filtra as datas disponíveis para manter apenas as que estão no presente ou futuro
      const horariosDisponiveis = produto.datasDisponiveis.filter((horario) =>
        isAfter(new Date(horario), agora),
      )

      const agendamentos = await prismaClient.agendamento.findMany({
        where: {
          servicoId: produto.id,
          deleted: false,
        },
        select: {
          data: true,
        },
      })

      // Filtra os horários disponíveis, excluindo aqueles que já foram reservados
      const horariosFiltrados = horariosDisponiveis.filter(
        (horario) =>
          !agendamentos.some((agendamento) => {
            const agendamentoData = agendamento.data
              ? new Date(agendamento.data).getTime()
              : null
            const horarioData = horario ? new Date(horario).getTime() : null

            return (
              agendamentoData !== null &&
              horarioData !== null &&
              agendamentoData === horarioData
            )
          }),
      )

      // Se houver horários filtrados e no futuro, adiciona o produto à lista final
      if (horariosFiltrados.length > 0) {
        produto.datasDisponiveis = horariosFiltrados
        produtosComHorariosDisponiveis.push(produto)
      }
    }

    return produtosComHorariosDisponiveis
  }
}

export { FetchUserProductsService }
