"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsersController = void 0;
const FetchUsersService_1 = require("../services/FetchUsersService");
class FetchUsersController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchUsersService = new FetchUsersService_1.FetchUsersService();
        const user = await fetchUsersService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(user);
    }
}
exports.FetchUsersController = FetchUsersController;
