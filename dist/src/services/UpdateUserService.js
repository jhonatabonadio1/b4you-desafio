"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class UpdateUserService {
    async execute({ usuarioId, matricula, nome, email, cpf, phone, password, tipoAcesso, birth, }) {
        const user = await prismaClient_1.prismaClient.usuario.findUnique({
            where: { id: usuarioId, deleted: false },
        });
        if (user) {
            if (matricula) {
                const verifyMatriculaAlreadyExists = await prismaClient_1.prismaClient.usuario.findFirst({
                    where: { matricula, deleted: false, NOT: { id: usuarioId } },
                });
                if (verifyMatriculaAlreadyExists) {
                    throw new Error('Matrícula já inserida no sistema.');
                }
            }
            if (cpf) {
                const inscricaoString = cpf.toString().replace(/\D/g, '');
                const validateCpf = cpf_cnpj_validator_1.cpf.isValid(inscricaoString, true);
                if (!validateCpf) {
                    throw new Error('CPF inválido.');
                }
                const verifyDocAlreadyExists = await prismaClient_1.prismaClient.usuario.findFirst({
                    where: {
                        matricula: inscricaoString,
                        deleted: false,
                        NOT: { id: usuarioId },
                    },
                });
                if (verifyDocAlreadyExists) {
                    throw new Error('CPF já cadastrado no sistema.');
                }
            }
            if (email) {
                const verifyEmailAlreadyExists = await prismaClient_1.prismaClient.usuario.findFirst({
                    where: { email, deleted: false, NOT: { id: usuarioId } },
                });
                if (verifyEmailAlreadyExists) {
                    throw new Error('E-mail já cadastrado no sistema.');
                }
            }
            const birthDate = new Date(birth);
            birthDate.setUTCHours(6, 0, 0, 0);
            const passwordHash = password ? await (0, bcryptjs_1.hash)(password, 8) : user.password;
            const inscricaoString = matricula
                ? matricula.toString().replace(/\D/g, '')
                : user.matricula;
            const updateUserService = await prismaClient_1.prismaClient.usuario.update({
                where: { id: usuarioId, deleted: false },
                data: {
                    matricula: inscricaoString,
                    nome: nome || user.nome,
                    email: email || user.email,
                    cpf: cpf || user.cpf,
                    phone: phone || user.phone,
                    birth: birthDate || user.birth,
                    tipoAcesso: tipoAcesso || user.tipoAcesso,
                    password: passwordHash,
                },
            });
            const userWithoutPassword = exclude(updateUserService, ['password']);
            return userWithoutPassword;
        }
    }
}
exports.UpdateUserService = UpdateUserService;
