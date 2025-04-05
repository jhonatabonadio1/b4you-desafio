"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorHealthController = void 0;
const MonitorHealthService_1 = require("../../../services/common/health/MonitorHealthService");
class MonitorHealthController {
    async handle(request, response) {
        try {
            const monitorHealthService = new MonitorHealthService_1.MonitorHealthService();
            const monitor = await monitorHealthService.execute();
            return response.status(200).render('monitor', monitor);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.MonitorHealthController = MonitorHealthController;
