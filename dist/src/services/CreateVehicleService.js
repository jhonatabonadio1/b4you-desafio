"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehicleService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreateVehicleService {
    async execute({ nome, placa, categoria, marca, modelo, userId }) {
        if (!placa) {
            throw new Error('Placa inválida.');
        }
        if (!nome) {
            throw new Error('Nome é obrigatório');
        }
        if (!categoria) {
            throw new Error('Categoria é obrigatória');
        }
        const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Usuário não encontrado.');
        }
        const veiculoAlreadyExists = await prismaClient_1.prismaClient.veiculo.findFirst({
            where: {
                placa,
                deleted: false,
            },
        });
        const veiculoUsuarioAlreadyExists = await prismaClient_1.prismaClient.veiculo.findFirst({
            where: {
                placa,
                usuario: {
                    cpf: findUser.cpf,
                    deleted: false,
                },
                deleted: false,
            },
        });
        if (veiculoAlreadyExists) {
            throw new Error('Veículo já cadastrado');
        }
        if (veiculoUsuarioAlreadyExists) {
            throw new Error('Veículo já cadastrado para o usuário');
        }
        const veiculo = await prismaClient_1.prismaClient.veiculo.create({
            data: {
                nome,
                placa,
                categoria,
                marca,
                modelo,
                usuario: {
                    connect: {
                        id: findUser.id,
                    },
                },
            },
        });
        return veiculo;
    }
}
exports.CreateVehicleService = CreateVehicleService;
