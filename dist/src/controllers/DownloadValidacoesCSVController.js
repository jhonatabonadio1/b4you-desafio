"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadValidacoesCSVController = void 0;
const DownloadValidacoesCSVService_1 = require("../services/DownloadValidacoesCSVService");
class DownloadValidacoesCSVController {
    async handle(request, response) {
        const { fromDate, toDate } = request.query;
        if (!fromDate || !toDate) {
            return response.status(400).json({ error: 'Datas inválidas' });
        }
        const downloadExcelService = new DownloadValidacoesCSVService_1.DownloadValidacoesCSVService();
        const workbook = await downloadExcelService.execute({
            fromDate: fromDate.toString(),
            toDate: toDate.toString(),
        });
        response.setHeader('Content-Disposition', 'attachment; filename="validacoes.xlsx"');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await workbook.xlsx.write(response);
        response.end();
    }
}
exports.DownloadValidacoesCSVController = DownloadValidacoesCSVController;
