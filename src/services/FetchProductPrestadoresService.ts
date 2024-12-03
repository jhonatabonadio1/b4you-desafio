import { prismaClient } from '../database/prismaClient'
import { isAfter } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

type IProduto = {
  produtoId: string
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

class FetchProductPrestadoresService {
  async execute({ produtoId }: IProduto) {
    const timeZone = 'America/Sao_Paulo' // Fuso horário de São Paulo
    const agora = toZonedTime(new Date(), timeZone) // Converte a hora atual no timezone para UTC
    const prestadoresComHorariosDisponiveis = []

    // Busca o produto/serviço com base no ID do produto
    const findProducts = await prismaClient.servico.findFirst({
      where: { id: produtoId, deleted: false },
    })

    if (findProducts) {
      // Itera sobre os IDs dos prestadores
      for (const prestadorId of findProducts.prestadores) {
        const buscaPrestador = await prismaClient.prestador.findFirst({
          where: { id: prestadorId, deleted: false, ativo: true },
        })

        if (buscaPrestador) {
          // Filtra as datas disponíveis para manter apenas as que estão no presente ou futuro
          const horariosDisponiveis = buscaPrestador.datasDisponiveis?.filter(
            (horario) => {
              const horarioUtc = toZonedTime(new Date(horario), timeZone)
              return isAfter(horarioUtc, agora)
            },
          )

          // Busca agendamentos já realizados para o prestador e produto específico
          const agendamentos = await prismaClient.agendamento.findMany({
            where: {
              servicoId: produtoId,
              prestadorId: buscaPrestador.id,
              ativo: true,
              deleted: false,
            },
            select: {
              data: true, // Apenas data é necessária para comparar os agendamentos
            },
          })

          // Filtra os horários disponíveis, excluindo aqueles que já foram reservados
          const horariosFiltrados = horariosDisponiveis?.filter(
            (horario) =>
              !agendamentos.some((agendamento) => {
                const agendamentoData = agendamento.data
                  ? toZonedTime(new Date(agendamento.data), timeZone).getTime()
                  : null
                const horarioData = horario
                  ? toZonedTime(new Date(horario), timeZone).getTime()
                  : null

                return (
                  agendamentoData !== null &&
                  horarioData !== null &&
                  agendamentoData === horarioData
                )
              }),
          )

          // Se houver horários filtrados e no futuro, adiciona o prestador à lista final
          if (horariosFiltrados && horariosFiltrados.length > 0) {
            buscaPrestador.datasDisponiveis = horariosFiltrados
            prestadoresComHorariosDisponiveis.push(
              exclude(buscaPrestador, [
                'password',
                'deleted',
                'inscricao',
                'tipoInscricao',
                'email',
              ]),
            )
          }
        }
      }
    }

    return prestadoresComHorariosDisponiveis ?? []
  }
}

export { FetchProductPrestadoresService }
