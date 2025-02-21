import { Router } from 'express'
import { FetchPlansController } from '../controllers/common/plans/FetchPlansController'

const plansRoutes = Router()

const fetchPlansController = new FetchPlansController()

plansRoutes.get('/plans', fetchPlansController.handle)

export { plansRoutes }
