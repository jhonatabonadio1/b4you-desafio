import { Router } from 'express'

import { MonitorHealthController } from '../controllers/common/health/MonitorHealthController'
import { HealthCheckController } from '../controllers/common/health/HealthCheckController'

const healthRoutes = Router()

const monitorHealthController = new MonitorHealthController()
const healthCheckController = new HealthCheckController()

healthRoutes.get('/health', healthCheckController.handle)
healthRoutes.get('/monitor', monitorHealthController.handle)

export { healthRoutes }
