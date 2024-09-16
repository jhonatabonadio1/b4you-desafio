"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsuarioBrindesService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Função exclude ajustada para aceitar arrays de objetos
function excludeArray(brindes, keys) {
    return brindes.map((brinde) => {
        const brindeCopy = Object.assign({}, brinde);
        keys.forEach((key) => delete brindeCopy[key]);
        return brindeCopy;
    });
}
class FetchUsuarioBrindesService {
    async execute({ userId }) {
        const user = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                id: userId,
                deleted: false,
            },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const agoraBrasil = moment_timezone_1.default.tz('America/Sao_Paulo');
        const hojeBrasilStr = agoraBrasil.format('YYYY-MM-DD');
        const buscaBrindes = await prismaClient_1.prismaClient.brinde.findMany({
            where: {
                deleted: false,
                ativo: true,
                OR: [
                    {
                        dataLimite: null,
                    },
                    {
                        dataLimite: {
                            gte: new Date(`${hojeBrasilStr}T00:00:00.000Z`),
                        },
                    },
                ],
            },
        });
        const usuariosBrindes = [];
        for (const brinde of buscaBrindes) {
            const verificaBrindeJaValidado = await prismaClient_1.prismaClient.validacaoBrinde.findFirst({
                where: {
                    brindeId: brinde.id,
                    usuarioId: user.id,
                },
            });
            if (!verificaBrindeJaValidado) {
                if (!brinde.todosUsuarios) {
                    const buscaUsuarioBrindes = brinde.usuariosEspecificos.find((item) => item === userId);
                    if (buscaUsuarioBrindes) {
                        usuariosBrindes.push(brinde);
                    }
                }
                else {
                    usuariosBrindes.push(brinde);
                }
            }
        }
        const usuariosBrindeEx = excludeArray(usuariosBrindes, [
            'prestadoresEspecificos',
            'usuariosEspecificos',
            'todosUsuarios',
            'todosPrestadores',
            'dataDisponibilidade',
            'deleted',
            'ativo',
            'created_at',
        ]);
        return usuariosBrindeEx;
    }
}
exports.FetchUsuarioBrindesService = FetchUsuarioBrindesService;
