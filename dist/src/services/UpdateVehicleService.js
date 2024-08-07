"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class UpdateVehicleService {
    async execute({ vehicleId, nome, placa, categoria }) {
        if (!vehicleId) {
            throw new Error('ID do veículo é obrigatório');
        }
        const findVehicle = await prismaClient_1.prismaClient.veiculo.findFirst({
            where: { id: vehicleId, deleted: false },
        });
        if (!findVehicle) {
            throw new Error('Veículo não encontrado.');
        }
        const veiculoAlreadyExists = await prismaClient_1.prismaClient.veiculo.findFirst({
            where: {
                id: {
                    not: vehicleId,
                },
                placa,
                deleted: false,
            },
        });
        if (veiculoAlreadyExists) {
            throw new Error('Veículo já cadastrado');
        }
        const updatedVeiculo = await prismaClient_1.prismaClient.veiculo.update({
            where: { id: findVehicle.id, deleted: false },
            data: {
                nome: nome || findVehicle.nome,
                placa: placa || findVehicle.placa,
                categoria: categoria || findVehicle.categoria,
            },
        });
        return updatedVeiculo;
    }
}
exports.UpdateVehicleService = UpdateVehicleService;
