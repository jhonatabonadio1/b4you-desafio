"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const ensureIsAuthenticated_1 = require("../middlewares/ensureIsAuthenticated");
const FetchUserDataController_1 = require("../controllers/common/users/FetchUserDataController");
const UpdateUserController_1 = require("../controllers/common/users/UpdateUserController");
const UpdateUserPasswordController_1 = require("../controllers/common/users/UpdateUserPasswordController");
const userInBlacklist_1 = require("../middlewares/userInBlacklist");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const fetchUserDataController = new FetchUserDataController_1.FetchUserDataController();
const updateUserController = new UpdateUserController_1.UpdateUserController();
const updateUserPasswordController = new UpdateUserPasswordController_1.UpdateUserPasswordController();
userRoutes.get('/me', ensureIsAuthenticated_1.ensureAuthenticated, fetchUserDataController.handle);
userRoutes.put('/users', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, updateUserController.handle);
userRoutes.put('/users/update-password', userInBlacklist_1.userInBlacklist, updateUserPasswordController.handle);
//# sourceMappingURL=userRoutes.js.map