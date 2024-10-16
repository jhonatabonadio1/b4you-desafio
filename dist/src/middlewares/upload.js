"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configura o multer para salvar o arquivo em uma pasta temporária
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: 'uploads/', // Pasta temporária
        filename: (req, file, cb) => {
            // Mantém a extensão do arquivo original
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${file.fieldname}-${Date.now()}${ext}`);
        },
    }),
});
exports.upload = upload;
