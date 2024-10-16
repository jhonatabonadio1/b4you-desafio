"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserCargaService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const FetchMemberExistsService_1 = require("./FetchMemberExistsService");
const Yup = __importStar(require("yup"));
// Exclude keys from user
function exclude(user, keys) {
    const userCopy = Object.assign({}, user);
    keys.forEach((key) => delete userCopy[key]);
    return userCopy;
}
class CreateUserCargaService {
    async execute({ nome, matricula, email, cpf, phone, password, birth, }) {
        const carga = new FetchMemberExistsService_1.FetchMemberExistsService();
        const verifyMemberExistInCarga = await carga.execute(matricula);
        if (!verifyMemberExistInCarga.Matricula) {
            throw new Error('Matrícula não encontrada');
        }
        // Validações básicas
        if (!matricula) {
            throw new Error('Matrícula inválida.');
        }
        if (!nome) {
            throw new Error('Nome é obrigatório');
        }
        if (!email) {
            throw new Error('E-mail é obrigatório');
        }
        if (!birth) {
            throw new Error('Data de nascimento é obrigatório');
        }
        // Formatar e validar o e-mail
        const formattedEmail = email.trim().toLowerCase();
        const emailSchema = Yup.string().email('E-mail inválido').required();
        try {
            await emailSchema.validate(formattedEmail);
        }
        catch (error) {
            throw new Error('E-mail inválido');
        }
        // Validar CPF
        const formattedDoc = cpf.replace(/\D/g, '');
        const validateCpf = cpf_cnpj_validator_1.cpf.isValid(formattedDoc, true);
        if (!validateCpf) {
            throw new Error('CPF inválido.');
        }
        // Verificar se já existe o usuário com essa matrícula, CPF ou e-mail
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
                email: formattedEmail, // Usar o e-mail formatado
                deleted: false,
            },
        });
        if (matericulaAlreadyExists || cpfAlreadyExists || emailAlreadyExists) {
            throw new Error('Usuário já cadastrado.');
        }
        // Criptografar senha
        const passwordHash = await (0, bcryptjs_1.hash)(password, 8);
        // Ajustar a data de nascimento
        const birthDate = new Date(birth);
        birthDate.setUTCHours(6, 0, 0, 0);
        // Criar o usuário
        const user = await prismaClient_1.prismaClient.usuario.create({
            data: {
                nome,
                matricula,
                email: formattedEmail, // Salvar o e-mail formatado
                avatarUrl: 'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg',
                phone,
                cpf: formattedDoc,
                password: passwordHash,
                birth: birthDate,
            },
        });
        // Remover a senha da resposta
        const userWithoutPassword = exclude(user, ['password']);
        return userWithoutPassword;
    }
}
exports.CreateUserCargaService = CreateUserCargaService;
