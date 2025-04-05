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
            return response.status(200).json(tokens);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.RefreshTokenController = RefreshTokenController;
