import { Router } from 'express'

import { authRoutes } from './authRoutes'
import { campaingRoutes } from './campaingRoutes'
import { healthRoutes } from './healthRoutes'

const routes = Router()

routes.use(authRoutes)
routes.use(campaingRoutes)
routes.use(healthRoutes)

export { routes }
