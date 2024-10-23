"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrestadorHorariosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class CreatePrestadorHorariosService {
    async execute({ prestadorId, data }) {
        const user = await prismaClient_1.prismaClient.prestador.findUnique({
            where: { id: prestadorId, deleted: false },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        for (const dataDisponivel of user.datasDisponiveis) {
            if (dataDisponivel === data) {
                throw new Error('Data e hora já adicionados');
            }
        }
        const datas = user.datasDisponiveis;
        datas.push(data);
        const updateData = await prismaClient_1.prismaClient.prestador.update({
            where: {
                id: user.id,
                deleted: false,
            },
            data: {
                datasDisponiveis: datas,
            },
        });
        return updateData;
    }
}
exports.CreatePrestadorHorariosService = CreatePrestadorHorariosService;
