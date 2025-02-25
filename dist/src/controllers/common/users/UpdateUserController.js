"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const UpdateUserService_1 = require("../../../services/common/users/UpdateUserService");
class UpdateUserController {
    async handle(request, response) {
        const { userId } = request;
        const { email, password, firstName, lastName, empresa } = request.body;
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        try {
            const result = await updateUserService.execute({
                userId,
                email,
                password,
                firstName,
                lastName,
                empresa,
            });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.UpdateUserController = UpdateUserController;
//# sourceMappingURL=UpdateUserController.js.map