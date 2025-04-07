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
            response.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/auth/token/refresh',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            return response.json({
                accessToken: result.accessToken,
                user: result.user,
            });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.SignInController = SignInController;
