"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docRoutes = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
const express_1 = require("express");
const DeleteFileController_1 = require("../controllers/common/files/DeleteFileController");
const GetFileController_1 = require("../controllers/common/files/GetFileController");
const GeneratePreSignedUrlController_1 = require("../controllers/common/files/GeneratePreSignedUrlController");
const FetchFilesController_1 = require("../controllers/common/files/FetchFilesController");
const ensureIsAuthenticated_1 = require("../middlewares/ensureIsAuthenticated");
const userInBlacklist_1 = require("../middlewares/userInBlacklist");
const CompleteUploadController_1 = require("../controllers/common/files/CompleteUploadController");
const docRoutes = (0, express_1.Router)();
exports.docRoutes = docRoutes;
const getFileController = new GetFileController_1.GetFileController();
const generatePreSignedUrlController = new GeneratePreSignedUrlController_1.GeneratePreSignedUrlController();
const fetchFilesController = new FetchFilesController_1.FetchFilesController();
const deleteFileController = new DeleteFileController_1.DeleteFileController();
const completeUploadController = new CompleteUploadController_1.CompleteUploadController();
docRoutes.get('/file/:docId', userInBlacklist_1.userInBlacklist, getFileController.handle);
docRoutes.post('/file/presign', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, generatePreSignedUrlController.handle);
docRoutes.post('/file/complete', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, completeUploadController.handle);
docRoutes.get('/files', ensureIsAuthenticated_1.ensureAuthenticated, fetchFilesController.handle);
docRoutes.delete('/files/:docId', ensureIsAuthenticated_1.ensureAuthenticated, userInBlacklist_1.userInBlacklist, deleteFileController.handle);
