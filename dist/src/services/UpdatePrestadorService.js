"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrestadorService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class UpdatePrestadorService {
    async execute({ prestadorId, inscricao, bairro, cep, cidade, endereco, estado, latitude, longitude, password, razaoSocial, tipoInscricao, email, }) {
        const user = await prismaClient_1.prismaClient.prestador.findUnique({
            where: { id: prestadorId, deleted: false },
        });
        if (user) {
            if (inscricao) {
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
                const verifyDocAlreadyExists = await prismaClient_1.prismaClient.prestador.findFirst({
                    where: {
                        inscricao: inscricaoString,
                        deleted: false,
                        NOT: { id: prestadorId },
                    },
                });
                if (verifyDocAlreadyExists) {
                    throw new Error('CNPJ já cadastrado no sistema.');
                }
            }
            if (email) {
                const verifyEmailAlreadyExists = await prismaClient_1.prismaClient.prestador.findFirst({
                    where: { email, deleted: false, NOT: { id: prestadorId } },
                });
                if (verifyEmailAlreadyExists) {
                    throw new Error('E-mail já cadastrado no sistema.');
                }
            }
            const passwordHash = password ? await (0, bcryptjs_1.hash)(password, 8) : user.password;
            const inscricaoString = inscricao
                ? inscricao.toString().replace(/\D/g, '')
                : user.inscricao;
            const updatePrestadorService = await prismaClient_1.prismaClient.prestador.update({
                where: { id: prestadorId, deleted: false },
                data: {
                    inscricao: inscricaoString,
                    bairro: bairro || user.bairro,
                    cep: cep || user.cep,
                    cidade: cidade || user.cidade,
                    endereco: endereco || user.endereco,
                    estado: estado || user.estado,
                    latitude: latitude || user.latitude,
                    longitude: longitude || user.longitude,
                    password: passwordHash,
                    razaoSocial: razaoSocial || user.razaoSocial,
                    tipoInscricao: tipoInscricao || user.tipoInscricao,
                    email: email || user.email,
                },
            });
            const userWithoutPassword = exclude(updatePrestadorService, ['password']);
            return userWithoutPassword;
        }
    }
}
exports.UpdatePrestadorService = UpdatePrestadorService;
