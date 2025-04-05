"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInController = void 0;
const SignInService_1 = require("../../../services/common/auth/SignInService");
class SignInController {
    async handle(request, response) {
        const { email, password } = request.body;
        const signInService = new SignInService_1.SignInService();
        try {
            const result = await signInService.execute({ email, password });
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SignInController = SignInController;
