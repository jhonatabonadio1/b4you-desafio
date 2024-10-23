"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProductPrestadoresService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const date_fns_1 = require("date-fns");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchProductPrestadoresService {
    async execute({ produtoId }) {
        var _a;
        const agora = (0, date_fns_1.subHours)(new Date(), 3); // Ajusta para GMT-3
        const prestadoresComHorariosDisponiveis = [];
        // Busca o produto/serviço com base no ID do produto
        const findProducts = await prismaClient_1.prismaClient.servico.findFirst({
            where: { id: produtoId, deleted: false },
        });
        if (findProducts) {
            // Itera sobre os IDs dos prestadores
            for (const prestadorId of findProducts.prestadores) {
                const buscaPrestador = await prismaClient_1.prismaClient.prestador.findFirst({
                    where: { id: prestadorId, deleted: false, ativo: true },
                });
                if (buscaPrestador) {
                    // Filtra as datas disponíveis para manter apenas as que estão no presente ou futuro
                    const horariosDisponiveis = (_a = buscaPrestador.datasDisponiveis) === null || _a === void 0 ? void 0 : _a.filter((horario) => (0, date_fns_1.isAfter)(new Date(horario), agora));
                    // Busca agendamentos já realizados para o prestador e produto específico
                    const agendamentos = await prismaClient_1.prismaClient.agendamento.findMany({
                        where: {
                            servicoId: produtoId,
                            prestadorId: buscaPrestador.id,
                            deleted: false,
                        },
                        select: {
                            data: true, // Apenas data é necessária para comparar os agendamentos
                        },
                    });
                    // Filtra os horários disponíveis, excluindo aqueles que já foram reservados
                    const horariosFiltrados = horariosDisponiveis === null || horariosDisponiveis === void 0 ? void 0 : horariosDisponiveis.filter((horario) => !agendamentos.some((agendamento) => {
                        const agendamentoData = agendamento.data
                            ? new Date(agendamento.data).getTime()
                            : null;
                        const horarioData = horario ? new Date(horario).getTime() : null;
                        return (agendamentoData !== null &&
                            horarioData !== null &&
                            agendamentoData === horarioData);
                    }));
                    // Se houver horários filtrados e no futuro, adiciona o prestador à lista final
                    if (horariosFiltrados && horariosFiltrados.length > 0) {
                        buscaPrestador.datasDisponiveis = horariosFiltrados;
                        prestadoresComHorariosDisponiveis.push(exclude(buscaPrestador, [
                            'password',
                            'deleted',
                            'inscricao',
                            'tipoInscricao',
                            'email',
                        ]));
                    }
                }
            }
        }
        return prestadoresComHorariosDisponiveis !== null && prestadoresComHorariosDisponiveis !== void 0 ? prestadoresComHorariosDisponiveis : agora;
    }
}
exports.FetchProductPrestadoresService = FetchProductPrestadoresService;
