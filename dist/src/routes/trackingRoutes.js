"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingRoutes = void 0;
const express_1 = require("express");
const FetchDocumentTrackingController_1 = require("../controllers/common/tracking/FetchDocumentTrackingController");
const ensureIsAuthenticated_1 = require("../middlewares/ensureIsAuthenticated");
const FetchPagesAnalyticsController_1 = require("../controllers/common/tracking/FetchPagesAnalyticsController");
const userInBlacklist_1 = require("../middlewares/userInBlacklist");
const trackingRoutes = (0, express_1.Router)();
exports.trackingRoutes = trackingRoutes;
const fetchDocumentTrackingController = new FetchDocumentTrackingController_1.FetchDocumentTrackingController();
const fetchPageAnalyticsController = new FetchPagesAnalyticsController_1.FetchPageAnalyticsController();
trackingRoutes.get('/tracking/:docId', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, fetchDocumentTrackingController.handle);
trackingRoutes.get('/tracking/:docId/pages', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, fetchPageAnalyticsController.handle);
//# sourceMappingURL=trackingRoutes.js.map