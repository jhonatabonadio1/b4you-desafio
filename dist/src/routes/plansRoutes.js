import { Router } from 'express';
import { FetchPlansController } from '../controllers/common/plans/FetchPlansController';
import { ensureAuthenticated } from '../middlewares/ensureIsAuthenticated';
import { FetchPlansAuthController } from '../controllers/common/plans/FetchPlansAuthController';
const plansRoutes = Router();
const fetchPlansController = new FetchPlansController();
const fetchPlansAuthController = new FetchPlansAuthController();
plansRoutes.get('/plans', fetchPlansController.handle);
plansRoutes.get('/plans/auth', ensureAuthenticated, fetchPlansAuthController.handle);
export { plansRoutes };
//# sourceMappingURL=plansRoutes.js.map