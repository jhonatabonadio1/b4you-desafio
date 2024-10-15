"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateProductService {
    async execute({ nome, imageUrl, prestadores, datasDisponiveis, diaResetLimite, 
    // preco,
    // precoCarroGrande,
    // precoCarroPequeno,
    ativo, usoMensal, opcoesAdicionais, exigeVeiculo, }) {
        if (!nome) {
            throw new Error('Nome é obrigatório');
        }
        if (prestadores.length === 0) {
            throw new Error('Selecione ao menos 1 prestador');
        }
        if (datasDisponiveis.length === 0) {
            throw new Error('Selecione ao menos 1 data');
        }
        // const precoCents = preco * 100
        // const precoCarroGrandeCents = precoCarroGrande ? precoCarroGrande * 100 : 0
        // const precoCarroPequenoCents = precoCarroPequeno
        //  ? precoCarroPequeno * 100
        //  : 0
        const product = await prismaClient_1.prismaClient.servico.create({
            data: {
                nome,
                imageUrl,
                prestadores,
                usoMensal,
                diaResetLimite,
                datasDisponiveis,
                exigeVeiculo,
                ativo,
                created_at: new Date(),
            },
            include: {
                opcoesAdicionais: true,
            },
        });
        if (opcoesAdicionais.length > 0) {
            for (const opcao of opcoesAdicionais) {
                await prismaClient_1.prismaClient.opcaoAdicional.create({
                    data: {
                        servico: {
                            connect: {
                                id: product.id,
                            },
                        },
                        nome: opcao.nome,
                        usoMensal: opcao.usoMensal,
                    },
                });
            }
        }
        return product;
    }
}
exports.CreateProductService = CreateProductService;
