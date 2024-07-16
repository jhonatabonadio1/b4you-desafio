"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBrindeService = void 0;
const prismaClient_1 = require("../database/prismaClient");
const qrcode_1 = require("qrcode");
class CreateBrindeService {
    async execute({ titulo, todosPrestadores, imageUrl, texto, dataDisponibilidade, dataLimite, todosUsuarios, prestadores, usuarios, ativo = false, }) {
        if (!titulo) {
            throw new Error('Título é obrigatório');
        }
        if (!todosPrestadores && (!prestadores || prestadores.length === 0)) {
            throw new Error('Selecione ao menos 1 prestador');
        }
        if (!todosUsuarios && (!usuarios || usuarios.length === 0)) {
            throw new Error('Selecione ao menos 1 usuário');
        }
        let disponibilidade = null;
        const hoje = new Date();
        hoje.setUTCHours(6, 0, 0, 0);
        if (ativo) {
            if (dataDisponibilidade) {
                throw new Error('Não pode informar a data de disponibilidade quando ativo for true.');
            }
            disponibilidade = hoje;
        }
        else {
            if (!dataDisponibilidade) {
                throw new Error('Data de disponibilidade é obrigatória quando ativo for false.');
            }
            disponibilidade = new Date(dataDisponibilidade);
            disponibilidade.setUTCHours(6, 0, 0, 0);
            if (disponibilidade < hoje) {
                throw new Error('A data de disponibilidade não pode ser no passado.');
            }
            ativo = disponibilidade <= hoje;
        }
        let limite = null;
        if (dataLimite) {
            limite = new Date(dataLimite);
            limite.setUTCHours(6, 0, 0, 0);
            if (limite < hoje) {
                throw new Error('A data limite não pode ser no passado.');
            }
        }
        if (limite && disponibilidade && disponibilidade > limite) {
            throw new Error('A data limite deve ser maior ou igual à data de disponibilidade.');
        }
        // Garantir que todosUsuarios e todosPrestadores sejam false se houver usuários ou prestadores específicos
        const todosUsuariosFinal = usuarios && usuarios.length > 0 ? false : todosUsuarios;
        const todosPrestadoresFinal = prestadores && prestadores.length > 0 ? false : todosPrestadores;
        // Cria o brinde no banco de dados
        const brinde = await prismaClient_1.prismaClient.brinde.create({
            data: {
                nome: titulo,
                imageUrl,
                data: texto,
                dataDisponibilidade: disponibilidade,
                dataLimite: limite,
                todosUsuarios: todosUsuariosFinal,
                todosPrestadores: todosPrestadoresFinal,
                usuariosEspecificos: todosUsuariosFinal ? [] : usuarios,
                prestadoresEspecificos: todosPrestadoresFinal ? [] : prestadores,
                ativo,
                created_at: new Date(),
            },
        });
        const qrCodeData = await (0, qrcode_1.toDataURL)(brinde.id);
        const updatedBrinde = await prismaClient_1.prismaClient.brinde.update({
            where: { id: brinde.id, deleted: false },
            data: { qrcode: qrCodeData },
        });
        return updatedBrinde;
    }
}
exports.CreateBrindeService = CreateBrindeService;
