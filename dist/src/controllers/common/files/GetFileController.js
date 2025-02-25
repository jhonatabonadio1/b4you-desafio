"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFileController = void 0;
const GetFileService_1 = require("../../../services/common/files/GetFileService");
class GetFileController {
    async handle(req, res) {
        const { docId } = req.params;
        if (!docId) {
            return res.status(400).json({ error: 'O ID do documento é obrigatório.' });
        }
        const getDocumentService = new GetFileService_1.GetFileService();
        try {
            const documentData = await getDocumentService.execute(docId);
            return res.status(200).json(documentData);
        }
        catch (error) {
            console.error('Erro ao obter documento:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.GetFileController = GetFileController;
//# sourceMappingURL=GetFileController.js.map