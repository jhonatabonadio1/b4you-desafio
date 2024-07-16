"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsuarioInformativosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
function excludeArray(brindes, keys) {
    return brindes.map((brinde) => {
        const brindeCopy = Object.assign({}, brinde);
        keys.forEach((key) => delete brindeCopy[key]);
        return brindeCopy;
    });
}
class FetchUsuarioInformativosService {
    async execute() {
        const informativos = await prismaClient_1.prismaClient.informativos.findMany({
            where: {
                deleted: false,
            },
        });
        return excludeArray(informativos, ['deleted', 'created_at']);
    }
}
exports.FetchUsuarioInformativosService = FetchUsuarioInformativosService;
