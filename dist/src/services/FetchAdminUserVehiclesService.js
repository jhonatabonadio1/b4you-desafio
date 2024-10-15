"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminUserVehiclesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchAdminUserVehiclesService {
    async execute({ userId }) {
        const findVehicles = await prismaClient_1.prismaClient.veiculo.findMany({
            where: { usuarioId: userId, deleted: false },
        });
        if (!findVehicles) {
            throw new Error('Veículo não encontrado');
        }
        return findVehicles;
    }
}
exports.FetchAdminUserVehiclesService = FetchAdminUserVehiclesService;
