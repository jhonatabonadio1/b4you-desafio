"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePrestadorHorariosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeletePrestadorHorariosService {
    async execute({ prestadorId, data }) {
        const user = await prismaClient_1.prismaClient.prestador.findUnique({
            where: { id: prestadorId, deleted: false },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const datas = user.datasDisponiveis;
        const findData = datas.find((item) => item === data);
        if (!findData) {
            throw new Error('Data não encontrada');
        }
        const removeData = datas.filter((item) => item !== data);
        const updateData = await prismaClient_1.prismaClient.prestador.update({
            where: { id: user.id, deleted: false },
            data: {
                datasDisponiveis: removeData,
            },
        });
        return updateData;
    }
}
exports.DeletePrestadorHorariosService = DeletePrestadorHorariosService;
