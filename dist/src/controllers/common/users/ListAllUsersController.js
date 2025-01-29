"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllUsersController = void 0;
const ListAllUsersService_1 = require("../../../services/common/users/ListAllUsersService");
class ListAllUsersController {
    async handle(request, response) {
        const { search } = request.query;
        const listAllUsersService = new ListAllUsersService_1.ListAllUsersService();
        try {
            const users = await listAllUsersService.execute(search);
            return response.status(200).json({ success: true, data: users });
        }
        catch (error) {
            return response.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.ListAllUsersController = ListAllUsersController;
