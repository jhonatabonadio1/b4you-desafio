import { prismaClient } from '../database/prismaClient'
import { Workbook } from 'exceljs'
import { toZonedTime } from 'date-fns-tz'
import { format, parseISO } from 'date-fns'

interface IDateRange {
  fromDate: string
  toDate: string
}

class DownloadUsuariosCSVService {
  async execute({ fromDate, toDate }: IDateRange) {
    const timeZone = 'America/Sao_Paulo' // Defina o fuso horário correto

    const from = toZonedTime(fromDate, timeZone) // Converte o horário local para UTC
    const to = toZonedTime(`${toDate}T23:59:59`, timeZone) // Ajusta para o final do dia no UTC

    const usuarios = await prismaClient.usuario.findMany({
      where: {
        created_at: {
          gte: from, // Início do intervalo
          lte: to, // Final do intervalo ajustado
        },
      },

      orderBy: { created_at: 'desc' },
    })

    // Configuração da planilha
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Validações')

    // Cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Matrícula', key: 'matricula', width: 30 },
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'CPF', key: 'cpf', width: 10 },
      { header: 'Data de nascimento', key: 'nascimento', width: 10 },
      { header: 'Telefone', key: 'telefone', width: 20 },
      { header: 'Criado em', key: 'criado', width: 20 },
      { header: 'Excluido?', key: 'excluido', width: 30 },
    ]

    // Dados
    usuarios.forEach((validacao) => {
      let criadoEm = ''
      if (validacao.created_at) {
        const agendamentoString = new Date(validacao.created_at).toISOString()
        criadoEm = format(parseISO(agendamentoString), "dd/MM/yyyy 'às' HH:mm")
      }

      let dataNascimento = ''
      if (validacao.created_at) {
        const agendamentoString = new Date(validacao.birth).toISOString()
        dataNascimento = format(
          parseISO(agendamentoString),
          "dd/MM/yyyy 'às' HH:mm",
        )
      }
      worksheet.addRow({
        id: validacao.id,
        matricula: validacao.matricula,
        nome: validacao.nome,
        cpf: validacao.cpf,
        nascimento: dataNascimento,
        telefone: validacao.phone,
        criado: criadoEm,
        excluido: validacao.deleted ? 'Sim' : 'Não',
      })
    })

    return workbook
  }
}

export { DownloadUsuariosCSVService }
