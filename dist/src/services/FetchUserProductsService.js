"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserProductsService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchUserProductsService {
    async execute() {
        const findProducts = await prismaClient_1.prismaClient.servico.findMany({
            where: { ativo: true, deleted: false },
            include: {
                opcoesAdicionais: true,
            },
        });
        const produtosComHorariosDisponiveis = [];
        for (const produto of findProducts) {
            const horariosDisponiveis = produto.datasDisponiveis;
            const agendamentos = await prismaClient_1.prismaClient.agendamento.findMany({
                where: {
                    ativo: true,
                    servicoId: produto.id,
                    deleted: false,
                },
                select: {
                    data: true,
                },
            });
            // Filtra os horários disponíveis, excluindo aqueles que já foram reservados
            const horariosFiltrados = horariosDisponiveis.filter((horario) => !agendamentos.some((agendamento) => agendamento.data === horario));
            // Se houver horários filtrados, adiciona o produto à lista final
            if (horariosFiltrados.length > 0) {
                produto.datasDisponiveis = horariosFiltrados;
                produtosComHorariosDisponiveis.push(produto);
            }
        }
        return produtosComHorariosDisponiveis;
    }
}
exports.FetchUserProductsService = FetchUserProductsService;
