"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUserController = void 0;
const FetchUserService_1 = require("../services/FetchUserService");
class FetchUserController {
    async handle(request, response) {
        const { usuarioId } = request.params;
        const fetchUserService = new FetchUserService_1.FetchUserService();
        const user = await fetchUserService.execute({
            usuarioId,
        });
        return response.json(user);
    }
}
exports.FetchUserController = FetchUserController;
