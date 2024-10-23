"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPrestadorHorariosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchPrestadorHorariosService {
    async execute({ prestadorId }) {
        const user = await prismaClient_1.prismaClient.prestador.findUnique({
            where: { id: prestadorId, deleted: false },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return {
            horarios: user.datasDisponiveis,
        };
    }
}
exports.FetchPrestadorHorariosService = FetchPrestadorHorariosService;
