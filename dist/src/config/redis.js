"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisConnection = {
    connection: new ioredis_1.default(process.env.REDIS_URL, {
        tls: {
            rejectUnauthorized: false, // Necessário para conexões seguras no Heroku
        },
        maxRetriesPerRequest: null,
    }),
};
