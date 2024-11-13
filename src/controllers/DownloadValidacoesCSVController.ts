import { Request, Response } from 'express'
import { DownloadValidacoesCSVService } from '../services/DownloadValidacoesCSVService'

class DownloadValidacoesCSVController {
  async handle(request: Request, response: Response) {
    const { fromDate, toDate } = request.query

    if (!fromDate || !toDate) {
      return response.status(400).json({ error: 'Datas inválidas' })
    }

    const downloadExcelService = new DownloadValidacoesCSVService()
    const workbook = await downloadExcelService.execute({
      fromDate: fromDate.toString(),
      toDate: toDate.toString(),
    })

    response.setHeader(
      'Content-Disposition',
      'attachment; filename="validacoes.xlsx"',
    )
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    await workbook.xlsx.write(response)
    response.end()
  }
}

export { DownloadValidacoesCSVController }
