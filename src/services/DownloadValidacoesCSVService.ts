import { format, parseISO } from 'date-fns'
import { prismaClient } from '../database/prismaClient'
import { Workbook } from 'exceljs'

interface IDateRange {
  fromDate: string
  toDate: string
}

class DownloadValidacoesCSVService {
  async execute({ fromDate, toDate }: IDateRange) {
    const validacoes = await prismaClient.validacaoAgendamento.findMany({
      where: {
        created_at: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
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
        agendamento: {
          include: {
            servico: {
              select: {
                nome: true,
              },
            },
            veiculo: true,
          },
        },
        created_at: true,
      },
      orderBy: { dataAvaliacao: 'desc' },
    })

    // Configuração da planilha
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Validações')

    // Cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Serviço', key: 'service', width: 30 },
      { header: 'Usuário (Nome)', key: 'user', width: 10 },
      { header: 'Usuário (CPF)', key: 'cpf', width: 10 },
      { header: 'Data Agendamento', key: 'dataAgendamento', width: 20 },
      { header: 'Prestador', key: 'prestador', width: 30 },
      { header: 'Prestador (CNPJ)', key: 'inscricao', width: 30 },
      { header: 'Data Validação', key: 'dataValidacao', width: 15 },
      { header: 'Placa', key: 'placa', width: 20 },
      { header: 'Veículo Categoria', key: 'categoria', width: 15 },
      { header: 'Veículo Modelo', key: 'modelo', width: 15 },
    ]

    // Dados
    validacoes.forEach((validacao) => {
      let dataAgendamento = ''
      if (validacao.agendamento.data) {
        const agendamentoString = new Date(
          validacao.agendamento.data,
        ).toISOString()
        dataAgendamento = format(
          parseISO(agendamentoString),
          "dd/MM/yyyy 'às' hh:MM",
        )
      }

      let dataValidacao = ''
      if (validacao.created_at) {
        const agendamentoString = new Date(validacao.created_at).toISOString()
        dataValidacao = format(
          parseISO(agendamentoString),
          "dd/MM/yyyy 'às' hh:MM",
        )
      }
      worksheet.addRow({
        id: validacao.id,
        service: validacao.agendamento.servico.nome,
        user: validacao.usuario.nome,
        cpf: validacao.usuario.cpf,
        dataAgendamneto: dataAgendamento,
        prestador: validacao.prestador?.razaoSocial,
        inscricao: validacao.prestador?.inscricao,
        dataValidacao,
        placa: validacao.agendamento.veiculo?.placa,
        categoria: validacao.agendamento.veiculo?.categoria,
        marca: validacao.agendamento.veiculo?.marca,
        modelo: validacao.agendamento.veiculo?.modelo,
      })
    })

    return workbook
  }
}

export { DownloadValidacoesCSVService }
