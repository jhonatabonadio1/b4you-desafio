"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBrindeService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class FetchBrindeService {
    async execute({ id }) {
        const brinde = await prismaClient_1.prismaClient.brinde.findFirst({
            where: {
                id,
                deleted: false,
            },
        });
        if (!brinde) {
            throw new Error('Brinde não encontrado');
        }
        const prestadoresArray = [];
        const usuariosArray = [];
        if (!brinde.todosPrestadores) {
            const buscaPrestadores = brinde.prestadoresEspecificos;
            for (const busca of buscaPrestadores) {
                const dadosPrestadores = await prismaClient_1.prismaClient.prestador.findFirst({
                    where: {
                        id: busca,
                        deleted: false,
                    },
                });
                if (dadosPrestadores) {
                    prestadoresArray.push({
                        label: dadosPrestadores.razaoSocial,
                        value: dadosPrestadores.id,
                    });
                }
            }
        }
        if (!brinde.todosUsuarios) {
            const buscaUsuarios = brinde.usuariosEspecificos;
            for (const busca of buscaUsuarios) {
                const dadosUsuarios = await prismaClient_1.prismaClient.usuario.findFirst({
                    where: {
                        id: busca,
                        deleted: false,
                    },
                });
                if (dadosUsuarios) {
                    usuariosArray.push({
                        label: dadosUsuarios.nome,
                        value: dadosUsuarios.id,
                    });
                }
            }
        }
        return Object.assign(Object.assign({}, brinde), { prestadoresEspecificos: brinde.todosPrestadores ? [] : prestadoresArray, usuariosEspecificos: brinde.todosUsuarios ? [] : usuariosArray });
    }
}
exports.FetchBrindeService = FetchBrindeService;
