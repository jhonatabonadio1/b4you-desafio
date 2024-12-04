import { prismaClient } from '../database/prismaClient'
import { Workbook } from 'exceljs'
import { toZonedTime } from 'date-fns-tz'
import { format, parseISO } from 'date-fns'

interface IDateRange {
  fromDate: string
  toDate: string
}

class DownloadBrindesCSVService {
  async execute({ fromDate, toDate }: IDateRange) {
    const timeZone = 'America/Sao_Paulo' // Defina o fuso horário correto

    const from = toZonedTime(fromDate, timeZone) // Converte o horário local para UTC
    const to = toZonedTime(`${toDate}T23:59:59`, timeZone) // Ajusta para o final do dia no UTC

    const validacoes = await prismaClient.validacaoBrinde.findMany({
      where: {
        created_at: {
          gte: from, // Início do intervalo
          lte: to, // Final do intervalo ajustado
        },
      },
      select: {
        id: true,

        prestador: {
          select: {
            razaoSocial: true,
            inscricao: true,
          },
        },
        usuario: {
          select: {
            nome: true,
            cpf: true,
          },
        },

        created_at: true,
        brinde: true,
      },
      orderBy: { created_at: 'desc' },
    })

    // Configuração da planilha
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Brindes')

    // Cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Brinde', key: 'service', width: 30 },
      { header: 'Usuário (Nome)', key: 'user', width: 10 },
      { header: 'Usuário (CPF)', key: 'cpf', width: 10 },
      { header: 'Prestador', key: 'prestador', width: 30 },
      { header: 'Prestador (CNPJ)', key: 'inscricao', width: 30 },
      { header: 'Data Validação', key: 'dataValidacao', width: 15 },
    ]

    // Dados
    validacoes.forEach((validacao) => {
      let dataValidacao = ''
      if (validacao.created_at) {
        const agendamentoString = new Date(validacao.created_at).toISOString()
        dataValidacao = format(
          parseISO(agendamentoString),
          "dd/MM/yyyy 'às' HH:mm",
        )
      }
      worksheet.addRow({
        id: validacao.id,
        service: validacao.brinde.nome,
        user: validacao.usuario.nome,
        cpf: validacao.usuario.cpf,
        prestador: validacao.prestador?.razaoSocial,
        inscricao: validacao.prestador?.inscricao,
        dataValidacao,
      })
    })

    return workbook
  }
}

export { DownloadBrindesCSVService }
