"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminController = void 0;
const AuthAdminService_1 = require("../services/AuthAdminService");
class AuthAdminController {
    async handle(request, response) {
        const { email, password } = request.body;
        const authAdminService = new AuthAdminService_1.AuthAdminService();
        const token = await authAdminService.execute({
            email,
            password,
        });
        return response.json(token);
    }
}
exports.AuthAdminController = AuthAdminController;
