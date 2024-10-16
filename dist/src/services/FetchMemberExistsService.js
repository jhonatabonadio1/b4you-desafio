"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMemberExistsService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const prismaClient_1 = require("../database/prismaClient");
// Configuração do S3
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
class FetchMemberExistsService {
    // Função principal para buscar o membro pelo código de matrícula
    async execute(matricula) {
        // 1. Buscar a última carga (planilha) registrada no MongoDB
        const lastCarga = await prismaClient_1.prismaClient.carga.findFirst({
            where: {
                deleted: false,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        if (!lastCarga || !lastCarga.link) {
            throw new Error('Sistema sem carga');
        }
        const key = this.extractS3KeyFromUrl(lastCarga.link);
        console.log(key);
        // 2. Ler o arquivo CSV diretamente do S3
        const memberData = await this.searchMemberInS3CSV(key, matricula);
        if (!memberData) {
            throw new Error('Membro não encontrado.');
        }
        // 3. Retornar o código de matrícula e o nome do membro
        return memberData;
    }
    // Função para procurar o membro diretamente no arquivo CSV no S3 usando streams
    searchMemberInS3CSV(s3Path, matricula) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Path,
            };
            const s3Stream = s3.getObject(params).createReadStream();
            s3Stream
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                if (row.Matricula === matricula) {
                    resolve({ Matricula: row.Matricula, Nome: row.Nome });
                }
            })
                .on('end', () => {
                resolve(null); // Membro não encontrado
            })
                .on('error', (error) => {
                reject(error);
            });
        });
    }
    extractS3KeyFromUrl(s3Url) {
        try {
            const url = new URL(s3Url);
            return decodeURIComponent(url.pathname.substring(1)); // Decodifica e remove a primeira barra "/"
        }
        catch (error) {
            console.error('Erro ao extrair o path da URL S3:', error);
            throw new Error('URL S3 inválida.');
        }
    }
}
exports.FetchMemberExistsService = FetchMemberExistsService;
