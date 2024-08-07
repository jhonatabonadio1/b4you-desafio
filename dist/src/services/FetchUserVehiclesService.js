"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserVehiclesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchUserVehiclesService {
    async execute({ userId }) {
        const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
            where: { id: userId, deleted: false },
        });
        if (!findUser) {
            throw new Error('Usuário não encotnrado.');
        }
        const veiculos = await prismaClient_1.prismaClient.veiculo.findMany({
            where: { usuario: { id: findUser.id }, deleted: false },
        });
        return veiculos;
    }
}
exports.FetchUserVehiclesService = FetchUserVehiclesService;
