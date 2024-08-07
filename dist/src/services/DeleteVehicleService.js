"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVehicleService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteVehicleService {
    async execute({ vehicleId }) {
        const vehicle = await prismaClient_1.prismaClient.veiculo.findUnique({
            where: { id: vehicleId, deleted: false },
        });
        if (!vehicle) {
            throw new Error('Veículo não encontrado.');
        }
        const updateVeiculoService = await prismaClient_1.prismaClient.veiculo.update({
            where: { id: vehicle.id, deleted: false },
            data: {
                deleted: true,
            },
        });
        return updateVeiculoService;
    }
}
exports.DeleteVehicleService = DeleteVehicleService;
