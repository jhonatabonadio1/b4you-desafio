"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsuarioConveniosController = void 0;
const FetchUsuarioConveniosService_1 = require("../services/FetchUsuarioConveniosService");
class FetchUsuarioConveniosController {
    async handle(request, response) {
        const fetchUserConveniosService = new FetchUsuarioConveniosService_1.FetchUsuarioConveniosService();
        const userConvenios = await fetchUserConveniosService.execute();
        return response.json(userConvenios);
    }
}
exports.FetchUsuarioConveniosController = FetchUsuarioConveniosController;
