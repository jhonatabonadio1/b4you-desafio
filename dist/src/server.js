"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = require("./routes/auth.routes");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
const PORT = process.env.PORT || 3333;
app.use(express_1.default.json());
app.use(auth_routes_1.authRoutes);
app.use((err, request, response, next) => {
    if (err instanceof Error) {
        console.log(err.message);
        return response.status(400).json({
            error: err.message,
        });
    }
    else {
        next();
    }
    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});
app.listen(PORT, () => console.log('Servidor iniciado.'));
