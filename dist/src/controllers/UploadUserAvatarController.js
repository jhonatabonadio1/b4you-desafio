"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadUserAvatarController = void 0;
const UploadUserAvatarService_1 = require("../services/UploadUserAvatarService");
class UploadUserAvatarController {
    async handle(request, response) {
        const { file, userId } = request; // Arquivo processado pelo multer
        const { tipoAcesso } = request.body;
        if (!file) {
            return response.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
        }
        const uploadAvatarService = new UploadUserAvatarService_1.UploadUserAvatarService();
        try {
            // Executa o serviço de upload, incluindo o upload para o S3 e remoção do arquivo temporário
            const updatedUser = await uploadAvatarService.execute(userId, file.path, file.originalname, tipoAcesso);
            // Retorna os dados do usuário atualizado com a nova URL do avatar
            return response.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Erro no upload do avatar:', error);
            return response.status(500).json({
                error: 'Erro ao processar o upload do avatar',
                details: error.message,
            });
        }
    }
}
exports.UploadUserAvatarController = UploadUserAvatarController;
