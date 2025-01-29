"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsersController = void 0;
const FetchUsersService_1 = require("../../../services/admin/users/FetchUsersService");
class FetchUsersController {
    async handle(request, response) {
        const { id } = request.query;
        try {
            const fetchUsersService = new FetchUsersService_1.FetchUsersService();
            const users = await fetchUsersService.execute(id);
            return response.status(200).json(users);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.FetchUsersController = FetchUsersController;
