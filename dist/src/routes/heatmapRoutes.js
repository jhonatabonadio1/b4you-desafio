"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heatmapRoutes = void 0;
const express_1 = require("express");
const CaptureHeatmapsController_1 = require("../controllers/common/heatmaps/CaptureHeatmapsController");
const FetchHeatmapsController_1 = require("../controllers/common/heatmaps/FetchHeatmapsController");
const ensureIsAuthenticated_1 = require("../middlewares/ensureIsAuthenticated");
const userInBlacklist_1 = require("../middlewares/userInBlacklist");
const heatmapRoutes = (0, express_1.Router)();
exports.heatmapRoutes = heatmapRoutes;
const captureHeatmapsController = new CaptureHeatmapsController_1.CaptureHeatmapsController();
const fetchHeatmapsController = new FetchHeatmapsController_1.FetchHeatmapsController();
heatmapRoutes.post('/heatmaps/lote', userInBlacklist_1.userInBlacklist, captureHeatmapsController.handle);
heatmapRoutes.get('/heatmaps/:docId/:page', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, fetchHeatmapsController.handle);
//# sourceMappingURL=heatmapRoutes.js.map