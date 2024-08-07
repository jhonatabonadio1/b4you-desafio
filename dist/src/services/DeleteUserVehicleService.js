"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserVehicleService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteUserVehicleService {
    async execute({ vehicleId, userId }) {
        const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Usuário não encontrado.');
        }
        const vehicle = await prismaClient_1.prismaClient.veiculo.findUnique({
            where: { id: vehicleId, deleted: false },
        });
        if (!vehicle) {
            throw new Error('Veículo não encontrado.');
        }
        if (vehicle.usuarioId !== findUser.id) {
            throw new Error('Usuário sem permissão.');
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
exports.DeleteUserVehicleService = DeleteUserVehicleService;
