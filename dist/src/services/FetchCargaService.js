"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCargaService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchCargaService {
    async execute() {
        const fetchCarga = await prismaClient_1.prismaClient.carga.findMany({
            where: { deleted: false },
            orderBy: {
                created_at: 'desc',
            },
        });
        return {
            cargas: fetchCarga,
            atual: fetchCarga[0] ? fetchCarga[0].id : null,
        };
    }
}
exports.FetchCargaService = FetchCargaService;
