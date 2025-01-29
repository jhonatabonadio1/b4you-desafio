"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadImageService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
class UploadImageService {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }
    async optimizeAndUpload(filePath, originalName) {
        if (!originalName) {
            throw new Error('O nome do arquivo não pode ser nulo');
        }
        const fileName = `${(0, uuid_1.v4)()}_${originalName}`;
        const buffer = await (0, sharp_1.default)(filePath)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toBuffer();
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: 'image/jpeg',
            ACL: 'public-read',
        };
        const uploadResult = await this.s3.upload(uploadParams).promise();
        await promises_1.default.unlink(filePath);
        return uploadResult.Location;
    }
}
exports.UploadImageService = UploadImageService;
