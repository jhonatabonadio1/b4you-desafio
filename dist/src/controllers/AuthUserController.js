"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserController = void 0;
const AuthUserService_1 = require("../services/AuthUserService");
class AuthUserController {
    async handle(request, response) {
        const { login, password, accessType } = request.body;
        const authUserService = new AuthUserService_1.AuthUserService();
        const token = await authUserService.execute({
            matricula: login,
            password,
            accessType,
        });
        return response.json(token);
    }
}
exports.AuthUserController = AuthUserController;
