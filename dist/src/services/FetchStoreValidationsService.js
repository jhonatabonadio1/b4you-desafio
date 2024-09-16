"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStoreValidationsService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchStoreValidationsService {
    async execute({ storeId }) {
        const findUser = await prismaClient_1.prismaClient.prestador.findFirst({
            where: { id: storeId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Prestador não encontrado');
        }
        const findAgendamnetos = await prismaClient_1.prismaClient.validacaoAgendamento.findMany({
            where: { prestador: { id: findUser.id } },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                usuario: true,
                agendamento: {
                    select: {
                        data: true,
                        ativo: true,
                        servico: true,
                        veiculo: true,
                        opcoesAdicionais: true,
                    },
                },
            },
        });
        const findBrindes = await prismaClient_1.prismaClient.validacaoBrinde.findMany({
            where: { prestador: { id: findUser.id } },
            include: {
                usuario: true,
                brinde: true,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const agendamentosValidados = [];
        for (const agendamento of findAgendamnetos) {
            const opcoesAdicionais = agendamento.agendamento.opcoesAdicionais.map(async (opcaoId) => await prismaClient_1.prismaClient.opcaoAdicional.findFirst({
                where: {
                    id: opcaoId,
                },
            }));
            const resposta = {
                id: agendamento.id,
                nome: agendamento.agendamento.servico.nome,
                data: agendamento.agendamento.data,
                ativo: agendamento.agendamento.ativo,
                tipo: 'booking',
                usuario: {
                    id: agendamento.usuario.id,
                    nome: agendamento.usuario.nome,
                    email: agendamento.usuario.email,
                    phone: agendamento.usuario.phone,
                },
                opcoesAdicionais, // Brindes geralmente não têm opções adicionais, mas pode ser ajustado conforme necessário
                veiculo: agendamento.agendamento.veiculo,
                dataValidacao: agendamento.created_at,
            };
            agendamentosValidados.push(resposta);
        }
        for (const brinde of findBrindes) {
            const resposta = {
                id: brinde.id,
                nome: brinde.brinde.nome,
                data: brinde.brinde.data,
                ativo: brinde.brinde.ativo,
                tipo: 'brinde',
                usuario: {
                    id: brinde.usuario.id,
                    nome: brinde.usuario.nome,
                    email: brinde.usuario.email,
                    phone: brinde.usuario.phone,
                },
                opcoesAdicionais: [], // Brindes geralmente não têm opções adicionais, mas pode ser ajustado conforme necessário
                veiculo: null,
                dataValidacao: brinde.created_at,
            };
            agendamentosValidados.push(resposta);
        }
        return agendamentosValidados;
    }
}
exports.FetchStoreValidationsService = FetchStoreValidationsService;
