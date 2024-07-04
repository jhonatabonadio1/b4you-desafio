"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPrestadoresController = void 0;
const FetchPrestadoresService_1 = require("../services/FetchPrestadoresService");
class FetchPrestadoresController {
    async handle(request, response) {
        const { page, search } = request.query;
        const fetchPrestadoresService = new FetchPrestadoresService_1.FetchPrestadoresService();
        const user = await fetchPrestadoresService.execute({
            page: page ? Number(page) : 1,
            search: search ? search.toString() : undefined,
        });
        return response.json(user);
    }
}
exports.FetchPrestadoresController = FetchPrestadoresController;
