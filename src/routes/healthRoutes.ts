import { Router } from 'express'

import { HealthCheckController } from '../controllers/common/health/HealthCheckController'

const healthRoutes = Router()

const healthCheckController = new HealthCheckController()

healthRoutes.get('/health', healthCheckController.handle)

export { healthRoutes }
