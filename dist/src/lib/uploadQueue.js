import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
export const uploadQueue = new Queue('pdf-upload-queue', redisConnection);
//# sourceMappingURL=uploadQueue.js.map