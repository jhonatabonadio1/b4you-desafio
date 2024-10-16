"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCargaController = void 0;
const UploadCargaService_1 = require("../services/UploadCargaService");
class UploadCargaController {
    async handle(request, response) {
        const { file } = request; // Arquivo processado pelo multer
        if (!file) {
            return response.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
        }
        const uploadCargaService = new UploadCargaService_1.UploadCargaService();
        try {
            // Executa o serviço de upload, incluindo o upload para o S3 e remoção do arquivo temporário
            const carga = await uploadCargaService.execute(file.path, file.originalname);
            // Retorna os dados da carga criada
            return response.status(200).json(carga);
        }
        catch (error) {
            console.error('Erro no upload:', error);
            return response.status(500).json({
                error: 'Erro ao processar o upload',
                details: error.message,
            });
        }
    }
}
exports.UploadCargaController = UploadCargaController;
