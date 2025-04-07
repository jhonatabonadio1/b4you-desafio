"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenController = void 0;
const RefreshTokenService_1 = require("../../../services/common/auth/RefreshTokenService");
class RefreshTokenController {
    async handle(request, response) {
        const { refreshToken } = request.body;
        const refreshTokenService = new RefreshTokenService_1.RefreshTokenService();
        try {
            const tokens = await refreshTokenService.execute(refreshToken);
            response.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/auth/token/refresh',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            return response.status(200).json({ accessToken: tokens.accessToken });
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.RefreshTokenController = RefreshTokenController;
