"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function ensureAuthenticated(request, response, next) {
    const { verify } = jsonwebtoken_1.default;
    const authToken = request.headers.authorization;
    if (!authToken) {
        return response.status(401).end();
    }
    const [, token] = authToken.split(' ');
    try {
        const { sub } = verify(token, process.env.JWT_SECRET);
        console.log(token);
        request.userId = sub;
        return next();
    }
    catch (err) {
        console.log(err);
        return response.status(401).end();
    }
}
