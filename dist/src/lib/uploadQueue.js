"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.uploadQueue = new bullmq_1.Queue('pdf-upload-queue', redis_1.redisConnection);
