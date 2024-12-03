"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAgendamentosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchAgendamentosService {
    async execute({ page, search }, pageSize = 10) {
        const baseWhere = { deleted: false };
        const searchWhere = search
            ? {
                AND: [
                    { deleted: false },
                    {
                        OR: [
                            {
                                servico: {
                                    nome: { contains: search, mode: 'insensitive' },
                                },
                            },
                            {
                                usuario: {
                                    cpf: { contains: search, mode: 'insensitive' },
                                    nome: { contains: search, mode: 'insensitive' },
                                },
                            },
                            {
                                veiculo: {
                                    placa: { contains: search, mode: 'insensitive' },
                                },
                            },
                            {
                                prestador: {
                                    razaoSocial: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                    inscricao: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalAgendamentos = await prismaClient_1.prismaClient.agendamento.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalAgendamentos / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const agendamentos = await prismaClient_1.prismaClient.agendamento.findMany({
            where: searchWhere,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                ativo: true,
                semValidade: true,
                veiculo: {
                    select: {
                        placa: true,
                        modelo: true,
                        marca: true,
                        categoria: true,
                    },
                },
                prestador: {
                    select: {
                        razaoSocial: true,
                        inscricao: true,
                    },
                },
                servico: {
                    select: {
                        nome: true,
                    },
                },
                usuario: {
                    select: {
                        nome: true,
                        cpf: true,
                    },
                },
                data: true,
                opcoesAdicionais: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
        const agendamentosComParsedOpcoes = agendamentos.map((agendamento) => (Object.assign(Object.assign({}, agendamento), { opcoesAdicionais: agendamento.opcoesAdicionais
                ? JSON.parse(agendamento.opcoesAdicionais)
                : null })));
        return {
            agendamentos: agendamentosComParsedOpcoes,
            currentPage: page,
            totalPages,
            totalAgendamentos,
        };
    }
}
exports.FetchAgendamentosService = FetchAgendamentosService;
