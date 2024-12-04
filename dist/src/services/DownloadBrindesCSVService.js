"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadBrindesCSVService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const exceljs_1 = require("exceljs");
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
class DownloadBrindesCSVService {
    async execute({ fromDate, toDate }) {
        const timeZone = 'America/Sao_Paulo'; // Defina o fuso horário correto
        const from = (0, date_fns_tz_1.toZonedTime)(fromDate, timeZone); // Converte o horário local para UTC
        const to = (0, date_fns_tz_1.toZonedTime)(`${toDate}T23:59:59`, timeZone); // Ajusta para o final do dia no UTC
        const validacoes = await prismaClient_1.prismaClient.validacaoBrinde.findMany({
            where: {
                created_at: {
                    gte: from, // Início do intervalo
                    lte: to, // Final do intervalo ajustado
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
                created_at: true,
                brinde: true,
            },
            orderBy: { created_at: 'desc' },
        });
        // Configuração da planilha
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet('Brindes');
        // Cabeçalhos
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Brinde', key: 'service', width: 30 },
            { header: 'Usuário (Nome)', key: 'user', width: 10 },
            { header: 'Usuário (CPF)', key: 'cpf', width: 10 },
            { header: 'Prestador', key: 'prestador', width: 30 },
            { header: 'Prestador (CNPJ)', key: 'inscricao', width: 30 },
            { header: 'Data Validação', key: 'dataValidacao', width: 15 },
        ];
        // Dados
        validacoes.forEach((validacao) => {
            var _a, _b;
            let dataValidacao = '';
            if (validacao.created_at) {
                const agendamentoString = new Date(validacao.created_at).toISOString();
                dataValidacao = (0, date_fns_1.format)((0, date_fns_1.parseISO)(agendamentoString), "dd/MM/yyyy 'às' HH:mm");
            }
            worksheet.addRow({
                id: validacao.id,
                service: validacao.brinde.nome,
                user: validacao.usuario.nome,
                cpf: validacao.usuario.cpf,
                prestador: (_a = validacao.prestador) === null || _a === void 0 ? void 0 : _a.razaoSocial,
                inscricao: (_b = validacao.prestador) === null || _b === void 0 ? void 0 : _b.inscricao,
                dataValidacao,
            });
        });
        return workbook;
    }
}
exports.DownloadBrindesCSVService = DownloadBrindesCSVService;
