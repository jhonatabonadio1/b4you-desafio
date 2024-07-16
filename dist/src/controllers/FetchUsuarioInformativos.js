"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsuarioInformativosController = void 0;
const FetchUsuarioInformativosService_1 = require("../services/FetchUsuarioInformativosService");
class FetchUsuarioInformativosController {
    async handle(request, response) {
        const fetchUserInformativosService = new FetchUsuarioInformativosService_1.FetchUsuarioInformativosService();
        const userInformativos = await fetchUserInformativosService.execute();
        return response.json(userInformativos);
    }
}
exports.FetchUsuarioInformativosController = FetchUsuarioInformativosController;
