import { Router } from 'express'

import { heatmapRoutes } from './heatmapRoutes'
import { authRoutes } from './authRoutes'
import { docRoutes } from './docRoutes'
import { userRoutes } from './userRoutes'

const routes = Router()

routes.use(heatmapRoutes)
routes.use(docRoutes)
routes.use(authRoutes)
routes.use(userRoutes)

export { routes }
