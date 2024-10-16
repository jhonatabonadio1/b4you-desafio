"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCargaService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class DeleteCargaService {
    async execute({ id }) {
        const deleteCarga = await prismaClient_1.prismaClient.carga.delete({
            where: { id, deleted: false },
        });
        return deleteCarga;
    }
}
exports.DeleteCargaService = DeleteCargaService;
