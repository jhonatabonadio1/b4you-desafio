"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLocationsService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class FetchLocationsService {
    async execute() {
        const locations = await prismaClient_1.prismaClient.locations.findMany();
        if (!locations || locations.length === 0) {
            throw new Error('Nenhuma localização encontrada.');
        }
        return locations;
    }
}
exports.FetchLocationsService = FetchLocationsService;
