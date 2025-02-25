import { Router } from 'express';
import { CreateSessionController } from '../controllers/common/sessions/CreateSessionController';
import { userInBlacklist } from '../middlewares/userInBlacklist';
const sessionsRoutes = Router();
const createSessionContorller = new CreateSessionController();
sessionsRoutes.post('/sessions', userInBlacklist, createSessionContorller.handle);
export { sessionsRoutes };
//# sourceMappingURL=sessionsRoutes.js.map