"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret = exports.tokens = void 0;
const csrf_1 = __importDefault(require("csrf"));
exports.tokens = new csrf_1.default();
exports.secret = exports.tokens.secretSync();
//# sourceMappingURL=csfrSecret.js.map