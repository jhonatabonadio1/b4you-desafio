"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidaQrCodeController = void 0;
const ValidaQrCodeService_1 = require("../services/ValidaQrCodeService");
class ValidaQrCodeController {
    async handle(request, response) {
        const validaQrCode = new ValidaQrCodeService_1.ValidaQrCodeService();
        const { clientCode, data } = request.body;
        const { userId } = request;
        const qrCode = await validaQrCode.execute({
            data,
            userId,
            clientCode,
        });
        return response.json(qrCode);
    }
}
exports.ValidaQrCodeController = ValidaQrCodeController;
