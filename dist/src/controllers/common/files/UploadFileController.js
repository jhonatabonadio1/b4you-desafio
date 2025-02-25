import fs from 'fs/promises';
import { uploadQueue } from '../../../lib/uploadQueue';
import { ObjectId } from 'mongodb';
export class UploadFileController {
    // Método para iniciar o upload
    async handle(req, res) {
        try {
            const { file, userId } = req;
            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }
            if (!userId) {
                // Se não tiver userId, você decide o que fazer
                // Mas vamos apagar o arquivo local
                await fs.unlink(file.path);
                return res.status(400).json({ error: 'Usuário não especificado' });
            }
            const geraIdDoDocumento = new ObjectId().toHexString();
            const job = await uploadQueue.add('upload', {
                filePath: file.path,
                originalName: file.originalname,
                fileId: geraIdDoDocumento,
                userId,
            });
            // Respondemos ao cliente com o jobId
            return res.json({
                message: 'Upload em processamento...',
                title: file.originalname,
                id: geraIdDoDocumento,
                jobId: job.id,
            });
        }
        catch (error) {
            console.error('Erro ao iniciar upload:', error);
            return res.status(500).json({ error: 'Erro ao iniciar upload' });
        }
    }
}
//# sourceMappingURL=UploadFileController.js.map