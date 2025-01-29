"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllPropertiesController = void 0;
const ListAllPropertiesService_1 = require("../../../services/common/properties/ListAllPropertiesService");
class ListAllPropertiesController {
    async handle(request, response) {
        const service = new ListAllPropertiesService_1.ListAllPropertiesService();
        try {
            const properties = await service.execute();
            return response.status(200).json(properties);
        }
        catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }
}
exports.ListAllPropertiesController = ListAllPropertiesController;
