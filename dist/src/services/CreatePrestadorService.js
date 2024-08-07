"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrestadorService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class CreatePrestadorService {
    async execute({ inscricao, bairro, cep, cidade, endereco, estado, latitude, longitude, password, razaoSocial, tipoInscricao, email, }) {
        if (!inscricao) {
            throw new Error('Inscrição inválida.');
        }
        if (!razaoSocial) {
            throw new Error('Razão social é obrigatório');
        }
        if (!tipoInscricao) {
            throw new Error('Tipo inscrição é obrigatório');
        }
        if (tipoInscricao !== 'cpf' && tipoInscricao !== 'cnpj') {
            throw new Error('Tipo inscrição inválido');
        }
        if (!email) {
            throw new Error('E-mail é obrigatório');
        }
        const inscricaoString = inscricao.toString().replace(/\D/g, '');
        if (tipoInscricao === 'cpf') {
            const validateCpf = cpf_cnpj_validator_1.cpf.isValid(inscricaoString, true);
            if (!validateCpf) {
                throw new Error('CPF/CNPJ inválido.');
            }
        }
        if (tipoInscricao === 'cnpj') {
            const validateCpf = cpf_cnpj_validator_1.cnpj.isValid(inscricaoString, true);
            if (!validateCpf) {
                throw new Error('CPF/CNPJ inválido.');
            }
        }
        const inscricaoAlreadyExists = await prismaClient_1.prismaClient.prestador.findFirst({
            where: {
                inscricao: inscricaoString,
                deleted: false,
            },
        });
        if (inscricaoAlreadyExists) {
            throw new Error('Prestador já cadastrado.');
        }
        const passwordHash = await (0, bcryptjs_1.hash)(password, 8);
        const user = await prismaClient_1.prismaClient.prestador.create({
            data: {
                bairro,
                cep,
                cidade,
                endereco,
                estado,
                avatarUrl: 'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg',
                inscricao: inscricaoString,
                latitude,
                longitude,
                password: passwordHash,
                tipoInscricao,
                razaoSocial,
                email,
            },
        });
        const userWithoutPassword = exclude(user, ['password']);
        return userWithoutPassword;
    }
}
exports.CreatePrestadorService = CreatePrestadorService;
