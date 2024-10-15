"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceInfoController = void 0;
const GetServiceInfoService_1 = require("../services/GetServiceInfoService");
class GetServiceInfoController {
    async handle(request, response) {
        const service = new GetServiceInfoService_1.GetServiceInfoService();
        const { id } = request.params;
        const getService = await service.execute({ id });
        return response.json(getService);
    }
}
exports.GetServiceInfoController = GetServiceInfoController;
