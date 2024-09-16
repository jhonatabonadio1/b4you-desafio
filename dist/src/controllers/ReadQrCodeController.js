"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadQrCodeController = void 0;
const ReadQrCodeService_1 = require("../services/ReadQrCodeService");
class ReadQrCodeController {
    async handle(request, response) {
        const readQrCode = new ReadQrCodeService_1.ReadQrCodeService();
        const { data } = request.query;
        const { userId } = request;
        const qrCode = await readQrCode.execute({ data: data, userId });
        return response.json(qrCode);
    }
}
exports.ReadQrCodeController = ReadQrCodeController;
