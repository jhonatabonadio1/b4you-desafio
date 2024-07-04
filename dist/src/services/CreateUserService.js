"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class CreateUserService {
    async execute({ nome, matricula, email, cpf, phone, password, birth, }) {
        if (!matricula) {
            throw new Error('Matrícula inválido.');
        }
        if (!nome) {
            throw new Error('Nome é obrigatório');
        }
        if (!email) {
            throw new Error('E-mail é obrigatório');
        }
        const formattedDoc = cpf.replace(/\D/g, '');
        const validateCpf = cpf_cnpj_validator_1.cpf.isValid(formattedDoc, true);
        if (!validateCpf) {
            throw new Error('CPF inválido.');
        }
        const matericulaAlreadyExists = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                matricula,
                deleted: false,
            },
        });
        const cpfAlreadyExists = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                cpf: formattedDoc,
                deleted: false,
            },
        });
        const emailAlreadyExists = await prismaClient_1.prismaClient.usuario.findFirst({
            where: {
                email,
                deleted: false,
            },
        });
        if (matericulaAlreadyExists || cpfAlreadyExists || emailAlreadyExists) {
            throw new Error('Usuário já cadastrado.');
        }
        const passwordHash = await (0, bcryptjs_1.hash)(password, 8);
        const user = await prismaClient_1.prismaClient.usuario.create({
            data: {
                nome,
                matricula,
                email,
                phone,
                cpf: formattedDoc,
                password: passwordHash,
                birth,
            },
        });
        const userWithoutPassword = exclude(user, ['password']);
        return userWithoutPassword;
    }
}
exports.CreateUserService = CreateUserService;
