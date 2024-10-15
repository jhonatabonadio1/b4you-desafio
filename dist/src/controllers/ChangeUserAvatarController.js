"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUserAvatarController = void 0;
const ChangeUserAvatarService_1 = require("../services/ChangeUserAvatarService");
class ChangeUserAvatarController {
    async handle(request, response) {
        const { tipoAcesso, imageUrl } = request.body;
        const { userId } = request;
        const changeUserAvatarService = new ChangeUserAvatarService_1.ChangeUserAvatarService();
        const userAvatar = await changeUserAvatarService.execute({
            tipoAcesso,
            imageUrl,
            userId,
        });
        return response.json(userAvatar);
    }
}
exports.ChangeUserAvatarController = ChangeUserAvatarController;
