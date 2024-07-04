"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAuthMatriculaService = void 0;
const prismaClient_1 = require("../database/prismaClient");
class VerifyAuthMatriculaService {
    async execute({ matricula, accessType }) {
        if (!matricula) {
            throw new Error('Login é obrigatório.');
        }
        if (!accessType) {
            throw new Error('Tipo de acesso é obrigatório.');
        }
        if (accessType !== 1 && accessType !== 2) {
            throw new Error('Tipo de acesso inválido.');
        }
        if (accessType === 1) {
            const user = await prismaClient_1.prismaClient.usuario.findFirst({
                where: {
                    matricula,
                    deleted: false,
                },
            });
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            const firstName = user.nome.split(' ')[0];
            const response = {
                nome: firstName,
            };
            return response;
        }
        const inscricaoString = matricula.toString().replace(/\D/g, '');
        if (accessType === 2) {
            const user = await prismaClient_1.prismaClient.prestador.findFirst({
                where: {
                    inscricao: inscricaoString,
                    deleted: false,
                },
            });
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            const firstName = user.razaoSocial.split(' ')[0];
            const response = {
                nome: firstName,
            };
            return response;
        }
    }
}
exports.VerifyAuthMatriculaService = VerifyAuthMatriculaService;
