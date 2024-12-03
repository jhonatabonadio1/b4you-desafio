"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdminAgendamentoService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateAdminAgendamentoService {
    async execute({ userId, servicoId, horario, semValidade, observacao, prestadorId, opcoesAdicionais, veiculoId, }) {
        if (!servicoId || !prestadorId) {
            throw new Error('ID do serviço, ID do prestador  são obrigatórios');
        }
        if (!semValidade && !horario) {
            throw new Error('Horário é obrigatório');
        }
        const horarioDate = horario && new Date(horario);
        const [findUser, findPrestador, findServico] = await Promise.all([
            prismaClient_1.prismaClient.usuario.findFirst({
                where: { id: userId, deleted: false },
            }),
            prismaClient_1.prismaClient.prestador.findFirst({
                where: { id: prestadorId, deleted: false, ativo: true },
            }),
            prismaClient_1.prismaClient.servico.findFirst({
                where: { id: servicoId, deleted: false, ativo: true },
            }),
        ]);
        if (!findUser) {
            throw new Error('Usuário não encontrado');
        }
        if (!findPrestador) {
            throw new Error('Prestador não encontrado');
        }
        if (!findServico) {
            throw new Error('Serviço não encontrado');
        }
        const verificaHorarioJaReservado = await prismaClient_1.prismaClient.agendamento.findFirst({
            where: {
                servicoId,
                prestadorId,
                data: horarioDate,
                deleted: false,
                ativo: true,
            },
        });
        if (verificaHorarioJaReservado) {
            throw new Error('Horário já reservado.');
        }
        // const valor = findServico.preco
        if (findServico.exigeVeiculo) {
            if (!veiculoId) {
                throw new Error('ID do veículo é obrigatório');
            }
            const buscaVeiculo = await prismaClient_1.prismaClient.veiculo.findFirst({
                where: { id: veiculoId, deleted: false },
            });
            if (!buscaVeiculo) {
                throw new Error('Veículo não encontrado.');
            }
            /** valor =
              buscaVeiculo.categoria === 'grande'
                ? findServico.precoCarroGrande
                : findServico.precoCarroPequeno**/
        }
        if (opcoesAdicionais) {
            for (const opcao of opcoesAdicionais) {
                const opcoesDisponiveis = JSON.parse(findServico.opcoesAdicionais);
                const buscaOpcao = opcoesDisponiveis.find((item) => item.nome === opcao);
                // valor += findOpcao.value
                if (!buscaOpcao) {
                    throw new Error('Opção adicional não encontrada');
                }
            }
        }
        const opcoesAdicionaisString = JSON.stringify(opcoesAdicionais);
        const agendamento = await prismaClient_1.prismaClient.agendamento.create({
            data: {
                data: horarioDate,
                semValidade,
                ativo: true,
                veiculo: veiculoId ? { connect: { id: veiculoId } } : undefined,
                usuario: { connect: { id: findUser.id } },
                opcoesAdicionais: opcoesAdicionaisString,
                observacao,
                prestador: { connect: { id: prestadorId } },
                servico: { connect: { id: servicoId } },
            },
        });
        return agendamento;
    }
}
exports.CreateAdminAgendamentoService = CreateAdminAgendamentoService;
