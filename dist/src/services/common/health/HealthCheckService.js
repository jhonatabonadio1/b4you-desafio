"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const prismaClient_1 = require("../../../database/prismaClient");
class HealthCheckService {
    async execute() {
        const campaing = await prismaClient_1.prismaClient.campaing.findFirst();
        return campaing;
    }
}
exports.HealthCheckService = HealthCheckService;
