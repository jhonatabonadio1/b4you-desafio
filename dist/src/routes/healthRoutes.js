"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
const HealthCheckController_1 = require("../controllers/common/health/HealthCheckController");
const healthRoutes = (0, express_1.Router)();
exports.healthRoutes = healthRoutes;
const healthCheckController = new HealthCheckController_1.HealthCheckController();
healthRoutes.get('/health', healthCheckController.handle);
