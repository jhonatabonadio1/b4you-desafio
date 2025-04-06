"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckController = void 0;
const HealthCheckService_1 = require("../../../services/common/health/HealthCheckService");
class HealthCheckController {
    async handle(request, response) {
        try {
            const healthCheckService = new HealthCheckService_1.HealthCheckService();
            await healthCheckService.execute();
            return response.status(200).json({ status: 'OK' });
        }
        catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }
}
exports.HealthCheckController = HealthCheckController;
