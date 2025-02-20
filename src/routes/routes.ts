import { Router } from 'express'

import { heatmapRoutes } from './heatmapRoutes'
import { authRoutes } from './authRoutes'
import { docRoutes } from './docRoutes'
import { userRoutes } from './userRoutes'
import { sessionsRoutes } from './sessionsRoutes'
import { storageRoutes } from './storageRoutes'
import { trackingRoutes } from './trackingRoutes'
import { stripeRoutes } from './stripeRoutes'

const routes = Router()

routes.use(heatmapRoutes)
routes.use(docRoutes)
routes.use(authRoutes)
routes.use(userRoutes)
routes.use(sessionsRoutes)
routes.use(storageRoutes)
routes.use(trackingRoutes)
routes.use(stripeRoutes)

export { routes }
