"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPasswordController = void 0;
const UpdateUserPasswordService_1 = require("../../../services/common/users/UpdateUserPasswordService");
class UpdateUserPasswordController {
    async handle(request, response) {
        const { password, requestId } = request.body;
        const updateUserPasswordService = new UpdateUserPasswordService_1.UpdateUserPasswordService();
        try {
            const result = await updateUserPasswordService.execute({
                requestId: requestId,
                password,
            });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.UpdateUserPasswordController = UpdateUserPasswordController;
//# sourceMappingURL=UpdateUserPasswordController.js.map