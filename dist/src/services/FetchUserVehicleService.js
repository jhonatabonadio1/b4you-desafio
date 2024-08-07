"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserVehicleService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchUserVehicleService {
    async execute({ vehicleId, userId }) {
        const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
            where: { id: userId },
        });
        if (!findUser) {
            throw new Error('Usuário não encontrado.');
        }
        const veiculo = await prismaClient_1.prismaClient.veiculo.findUnique({
            where: { id: vehicleId, deleted: false },
        });
        if (!veiculo) {
            throw new Error('Veículo não encontrado');
        }
        else {
            if (veiculo.usuarioId !== findUser.id) {
                throw new Error('Usuário sem permissão.');
            }
            const vehicleData = {
                nome: veiculo.nome,
                placa: veiculo.placa,
                cpf: findUser.cpf,
                categoria: veiculo.categoria,
            };
            return vehicleData;
        }
    }
}
exports.FetchUserVehicleService = FetchUserVehicleService;
