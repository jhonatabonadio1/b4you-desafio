"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class UpdateProductService {
    async execute({ id, nome, imageUrl, prestadores, datasDisponiveis, diaResetLimite, ativo, usoMensal, opcoesAdicionais, exigeVeiculo, }) {
        // Verificar se o produto existe
        const productExists = await prismaClient_1.prismaClient.servico.findFirst({
            where: { id, deleted: false },
            include: { opcoesAdicionais: true }, // Incluindo as opções adicionais existentes
        });
        if (!productExists) {
            throw new Error('Serviço não encontrado');
        }
        // Atualizar dados do serviço
        const updatedProduct = await prismaClient_1.prismaClient.servico.update({
            where: { id },
            data: {
                nome,
                imageUrl,
                prestadores,
                datasDisponiveis,
                diaResetLimite,
                ativo,
                usoMensal,
                exigeVeiculo,
            },
            include: {
                opcoesAdicionais: true,
            },
        });
        // Obter IDs das opções adicionais existentes no banco
        const existingOpcoesIds = productExists.opcoesAdicionais.map((opcao) => opcao.id);
        // Obter IDs das opções adicionais enviadas no front-end
        const updatedOpcoesIds = (opcoesAdicionais === null || opcoesAdicionais === void 0 ? void 0 : opcoesAdicionais.map((opcao) => opcao.id)) || [];
        // Remover as opções adicionais que não estão mais presentes
        const opcoesToRemove = existingOpcoesIds.filter((id) => !updatedOpcoesIds.includes(id));
        if (opcoesToRemove.length > 0) {
            await prismaClient_1.prismaClient.opcaoAdicional.updateMany({
                where: { id: { in: opcoesToRemove } },
                data: { deleted: true },
            });
        }
        // Verificar e atualizar ou criar opções adicionais
        if (opcoesAdicionais && opcoesAdicionais.length > 0) {
            for (const opcao of opcoesAdicionais) {
                if (opcao.id) {
                    // Atualizar opções adicionais existentes
                    await prismaClient_1.prismaClient.opcaoAdicional.update({
                        where: { id: opcao.id },
                        data: {
                            nome: opcao.nome,
                            usoMensal: opcao.usoMensal,
                        },
                    });
                }
                else {
                    // Criar novas opções adicionais se não tiver ID
                    await prismaClient_1.prismaClient.opcaoAdicional.create({
                        data: {
                            servico: {
                                connect: {
                                    id: updatedProduct.id,
                                },
                            },
                            nome: opcao.nome,
                            usoMensal: opcao.usoMensal,
                        },
                    });
                }
            }
        }
        return updatedProduct;
    }
}
exports.UpdateProductService = UpdateProductService;
