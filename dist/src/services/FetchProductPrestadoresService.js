"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProductPrestadoresService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const date_fns_1 = require("date-fns");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class FetchProductPrestadoresService {
    async execute({ produtoId }) {
        var _a;
        const timeZone = 'America/Sao_Paulo'; // Fuso horário de São Paulo
        const agora = (0, moment_timezone_1.default)().tz(timeZone).format('YYYY-MM-DDTHH:mm:ss.000') + 'Z'; // Converte a hora atual no timezone para UTC
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
                    const horariosDisponiveis = (_a = buscaPrestador.datasDisponiveis) === null || _a === void 0 ? void 0 : _a.filter((horario) => {
                        return (0, date_fns_1.isAfter)(horario, agora);
                    });
                    // Busca agendamentos já realizados para o prestador e produto específico
                    const agendamentos = await prismaClient_1.prismaClient.agendamento.findMany({
                        where: {
                            servicoId: produtoId,
                            prestadorId: buscaPrestador.id,
                            ativo: true,
                            deleted: false,
                        },
                        select: {
                            data: true, // Apenas data é necessária para comparar os agendamentos
                        },
                    });
                    // Filtra os horários disponíveis, excluindo aqueles que já foram reservados
                    const horariosFiltrados = [];
                    for (const horario of horariosDisponiveis || []) {
                        let horarioConflitante = false;
                        for (const agendamento of agendamentos || []) {
                            // Extrair o horário do agendamento no formato HH:mm:ss
                            const agendamentoData = agendamento.data
                                ? new Date(agendamento.data).toISOString()
                                : null;
                            // Extrair o horário disponível no formato HH:mm:ss
                            const horarioData = horario || null;
                            // Verificar se os horários coincidem
                            if (agendamentoData &&
                                horarioData &&
                                agendamentoData === horarioData) {
                                horarioConflitante = true;
                                break; // Para de verificar outros agendamentos
                            }
                        }
                        // Adiciona o horário à lista se não houver conflito
                        if (!horarioConflitante) {
                            horariosFiltrados.push(horario);
                        }
                    }
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
        return prestadoresComHorariosDisponiveis !== null && prestadoresComHorariosDisponiveis !== void 0 ? prestadoresComHorariosDisponiveis : [];
    }
}
exports.FetchProductPrestadoresService = FetchProductPrestadoresService;
