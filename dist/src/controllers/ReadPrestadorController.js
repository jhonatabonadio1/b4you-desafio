"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadPrestadorController = void 0;
const ReadPrestadorSevice_1 = require("../services/ReadPrestadorSevice");
class ReadPrestadorController {
    async handle(request, response) {
        const { prestadorId } = request.params;
        const updatePrestadorService = new ReadPrestadorSevice_1.ReadPrestadorService();
        const user = await updatePrestadorService.execute({
            prestadorId,
        });
        return response.json(user);
    }
}
exports.ReadPrestadorController = ReadPrestadorController;
