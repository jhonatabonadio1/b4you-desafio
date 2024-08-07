"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchVehicleService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchVehicleService {
    async execute({ vehicleId }) {
        const veiculo = await prismaClient_1.prismaClient.veiculo.findUnique({
            where: { id: vehicleId, deleted: false },
        });
        if (!veiculo) {
            throw new Error('Veículo não encontrado');
        }
        else {
            const findUser = await prismaClient_1.prismaClient.usuario.findFirst({
                where: {
                    id: veiculo.usuarioId,
                    deleted: false,
                },
            });
            if (!findUser) {
                throw new Error('Usuário vinculado ao veículo não encontrado.');
            }
            const vehicleData = {
                id: veiculo.id,
                nome: veiculo.nome,
                placa: veiculo.placa,
                cpf: findUser.cpf,
                categoria: veiculo.categoria,
            };
            return vehicleData;
        }
    }
}
exports.FetchVehicleService = FetchVehicleService;
