"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsuarioConveniosService = void 0;
const prismaClient_1 = require("../database/prismaClient");
function excludeArray(brindes, keys) {
    return brindes.map((brinde) => {
        const brindeCopy = Object.assign({}, brinde);
        keys.forEach((key) => delete brindeCopy[key]);
        return brindeCopy;
    });
}
class FetchUsuarioConveniosService {
    async execute() {
        const convenios = await prismaClient_1.prismaClient.convenios.findMany({
            where: {
                deleted: false,
                ativo: true,
            },
        });
        return excludeArray(convenios, ['deleted', 'created_at']);
    }
}
exports.FetchUsuarioConveniosService = FetchUsuarioConveniosService;
