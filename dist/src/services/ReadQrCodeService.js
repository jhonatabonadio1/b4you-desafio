"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadQrCodeService = void 0;
const prismaClient_1 = require("../database/prismaClient");
function extractIdsFromString(inputString) {
    const regex = /(brinde|booking):([a-zA-Z0-9]+):user:([a-zA-Z0-9]+)/;
    const match = regex.exec(inputString);
    if (match) {
        return {
            type: match[1],
            id: match[2],
            userId: match[3],
        };
    }
    else {
        return null;
    }
}
class ReadQrCodeService {
    async execute({ data, userId }) {
        const dataExtracted = extractIdsFromString(data);
        if (!dataExtracted) {
            throw new Error('Invalid QR Code format.');
        }
        let result = {};
        const findPrestador = await prismaClient_1.prismaClient.prestador.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!findPrestador) {
            throw new Error('Prestador não encontrado.');
        }
        if (dataExtracted.type === 'booking') {
            const agendamento = await prismaClient_1.prismaClient.agendamento.findUnique({
                where: { id: dataExtracted.id, deleted: false },
                include: {
                    prestador: true,
                    usuario: true,
                    servico: {
                        include: {
                            opcoesAdicionais: true, // Incluir as opções adicionais relacionadas ao serviço
                        },
                    },
                },
            });
            if (!agendamento) {
                throw new Error('Agendamento not found.');
            }
            const buscaAgendamentoJaValidado = await prismaClient_1.prismaClient.validacaoAgendamento.findFirst({
                where: {
                    agendamentoId: agendamento.id,
                },
            });
            if (buscaAgendamentoJaValidado) {
                throw new Error('Agendamento já validado.');
            }
            if (agendamento.prestadorId !== findPrestador.id) {
                throw new Error('Prestador não autorizado');
            }
            if (!agendamento.ativo) {
                throw new Error('Esse agendamento está inativo.');
            }
            const opcoesAdicionais = agendamento.opcoesAdicionais.map((opcaoId) => agendamento.servico.opcoesAdicionais.find((opcao) => opcao.id === opcaoId));
            let dadosVeiculo;
            if (agendamento.veiculoId) {
                dadosVeiculo = await prismaClient_1.prismaClient.veiculo.findFirst({
                    where: { id: agendamento.veiculoId, deleted: false },
                });
            }
            result = {
                id: agendamento.id,
                nome: agendamento.servico.nome,
                data: agendamento.data,
                ativo: agendamento.ativo,
                tipo: 'booking',
                usuario: {
                    id: agendamento.usuario.id,
                    nome: agendamento.usuario.nome,
                    email: agendamento.usuario.email,
                    phone: agendamento.usuario.phone,
                },
                prestador: {
                    id: agendamento.prestador.id,
                    razaoSocial: agendamento.prestador.razaoSocial,
                    email: agendamento.prestador.email,
                    ativo: agendamento.prestador.ativo,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                opcoesAdicionais: opcoesAdicionais.map((opcao) => ({
                    id: opcao.id,
                    nome: opcao.nome,
                    value: opcao.value,
                })),
                veiculo: dadosVeiculo,
            };
        }
        else if (dataExtracted.type === 'brinde') {
            const brinde = await prismaClient_1.prismaClient.brinde.findUnique({
                where: { id: dataExtracted.id, deleted: false },
            });
            const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
                where: { id: dataExtracted.userId, deleted: false },
            });
            if (!findUser) {
                throw new Error('Usuário não encontrado');
            }
            if (!brinde) {
                throw new Error('Brinde não encontrado');
            }
            const buscaBrindeJaValidado = await prismaClient_1.prismaClient.validacaoBrinde.findFirst({
                where: {
                    brindeId: brinde.id,
                },
            });
            if (buscaBrindeJaValidado) {
                throw new Error('Brinde já validado.');
            }
            if (!brinde.ativo) {
                throw new Error('Brinde indisponíevl.');
            }
            if (!brinde.todosPrestadores) {
                const prestadoresBrinde = brinde.prestadoresEspecificos;
                if (!brinde.prestadoresEspecificos) {
                    throw new Error('Prestador não autorizado.');
                }
                const prestadorAuthorizedToValidate = prestadoresBrinde.find((item) => item === findPrestador.id);
                if (!prestadorAuthorizedToValidate) {
                    throw new Error('Prestador não autorizado.');
                }
            }
            result = {
                id: brinde.id,
                nome: brinde.nome,
                data: brinde.dataDisponibilidade,
                ativo: brinde.ativo,
                tipo: 'brinde',
                usuario: {
                    id: findUser.id,
                    nome: findUser.nome,
                    email: findUser.email,
                    phone: findUser.phone,
                },
                prestador: {
                    id: findPrestador.id,
                    razaoSocial: findPrestador.razaoSocial,
                    email: findPrestador.email,
                    ativo: findPrestador.ativo,
                },
                opcoesAdicionais: [], // Brindes geralmente não têm opções adicionais, mas pode ser ajustado conforme necessário
                veiculo: null,
            };
        }
        else {
            throw new Error('Invalid QR Code type.');
        }
        return result;
    }
}
exports.ReadQrCodeService = ReadQrCodeService;
