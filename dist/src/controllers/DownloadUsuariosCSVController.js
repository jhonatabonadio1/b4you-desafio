"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadUsuariosCSVController = void 0;
const DownloadUsuariosCSVService_1 = require("../services/DownloadUsuariosCSVService");
class DownloadUsuariosCSVController {
    async handle(request, response) {
        const { fromDate, toDate } = request.query;
        if (!fromDate || !toDate) {
            return response.status(400).json({ error: 'Datas inválidas' });
        }
        const downloadExcelService = new DownloadUsuariosCSVService_1.DownloadUsuariosCSVService();
        const workbook = await downloadExcelService.execute({
            fromDate: fromDate.toString(),
            toDate: toDate.toString(),
        });
        response.setHeader('Content-Disposition', 'attachment; filename="usuarios.xlsx"');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await workbook.xlsx.write(response);
        response.end();
    }
}
exports.DownloadUsuariosCSVController = DownloadUsuariosCSVController;
