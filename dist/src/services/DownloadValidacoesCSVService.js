"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadValidacoesCSVService = void 0;
const date_fns_1 = require("date-fns");
const prismaClient_1 = require("../database/prismaClient");
const exceljs_1 = require("exceljs");
class DownloadValidacoesCSVService {
    async execute({ fromDate, toDate }) {
        const validacoes = await prismaClient_1.prismaClient.validacaoAgendamento.findMany({
            where: {
                created_at: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate),
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
                agendamento: {
                    include: {
                        servico: {
                            select: {
                                nome: true,
                            },
                        },
                        veiculo: true,
                    },
                },
                created_at: true,
            },
            orderBy: { dataAvaliacao: 'desc' },
        });
        // Configuração da planilha
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet('Validações');
        // Cabeçalhos
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Serviço', key: 'service', width: 30 },
            { header: 'Usuário (Nome)', key: 'user', width: 10 },
            { header: 'Usuário (CPF)', key: 'cpf', width: 10 },
            { header: 'Data Agendamento', key: 'dataAgendamento', width: 20 },
            { header: 'Prestador', key: 'prestador', width: 30 },
            { header: 'Prestador (CNPJ)', key: 'inscricao', width: 30 },
            { header: 'Data Validação', key: 'dataValidacao', width: 15 },
            { header: 'Placa', key: 'placa', width: 20 },
            { header: 'Veículo Categoria', key: 'categoria', width: 15 },
            { header: 'Veículo Modelo', key: 'modelo', width: 15 },
        ];
        // Dados
        validacoes.forEach((validacao) => {
            var _a, _b, _c, _d, _e, _f;
            let dataAgendamento = '';
            if (validacao.agendamento.data) {
                const agendamentoString = new Date(validacao.agendamento.data).toISOString();
                dataAgendamento = (0, date_fns_1.format)((0, date_fns_1.parseISO)(agendamentoString), "dd/MM/yyyy 'às' hh:MM");
            }
            let dataValidacao = '';
            if (validacao.created_at) {
                const agendamentoString = new Date(validacao.created_at).toISOString();
                dataValidacao = (0, date_fns_1.format)((0, date_fns_1.parseISO)(agendamentoString), "dd/MM/yyyy 'às' hh:MM");
            }
            worksheet.addRow({
                id: validacao.id,
                service: validacao.agendamento.servico.nome,
                user: validacao.usuario.nome,
                cpf: validacao.usuario.cpf,
                dataAgendamneto: dataAgendamento,
                prestador: (_a = validacao.prestador) === null || _a === void 0 ? void 0 : _a.razaoSocial,
                inscricao: (_b = validacao.prestador) === null || _b === void 0 ? void 0 : _b.inscricao,
                dataValidacao,
                placa: (_c = validacao.agendamento.veiculo) === null || _c === void 0 ? void 0 : _c.placa,
                categoria: (_d = validacao.agendamento.veiculo) === null || _d === void 0 ? void 0 : _d.categoria,
                marca: (_e = validacao.agendamento.veiculo) === null || _e === void 0 ? void 0 : _e.marca,
                modelo: (_f = validacao.agendamento.veiculo) === null || _f === void 0 ? void 0 : _f.modelo,
            });
        });
        return workbook;
    }
}
exports.DownloadValidacoesCSVService = DownloadValidacoesCSVService;
