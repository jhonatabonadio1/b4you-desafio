"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchVehiclesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchVehiclesService {
    async execute({ page, search }, pageSize = 2) {
        const baseWhere = { deleted: false };
        const searchWhere = search
            ? {
                AND: [
                    { deleted: false },
                    {
                        OR: [
                            { nome: { contains: search, mode: 'insensitive' } },
                            { placa: { contains: search, mode: 'insensitive' } },
                            {
                                categoria: { contains: search, mode: 'insensitive' },
                            },
                            {
                                usuario: {
                                    cpf: { contains: search, mode: 'insensitive' },
                                },
                            },
                        ],
                    },
                ],
            }
            : baseWhere;
        const totalUsers = await prismaClient_1.prismaClient.veiculo.count({
            where: searchWhere,
        });
        const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1);
        page = Math.min(Math.max(page, 1), totalPages);
        const veiculos = await prismaClient_1.prismaClient.veiculo.findMany({
            where: searchWhere,
            include: {
                usuario: true,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        const veiculosFormatados = [];
        for (const veiculo of veiculos) {
            veiculosFormatados.push({
                id: veiculo.id,
                nome: veiculo.nome,
                cpf: veiculo.usuario.cpf,
                placa: veiculo.placa,
                categoria: veiculo.categoria,
                created_at: veiculo.created_at,
            });
        }
        return {
            veiculos: veiculosFormatados,
            currentPage: page,
            totalPages,
            totalUsers,
        };
    }
}
exports.FetchVehiclesService = FetchVehiclesService;
