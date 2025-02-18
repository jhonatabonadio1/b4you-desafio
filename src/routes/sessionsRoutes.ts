import { Router } from 'express'

import { CreateSessionController } from '../controllers/common/sessions/CreateSessionController'

const sessionsRoutes = Router()

const createSessionContorller = new CreateSessionController()

sessionsRoutes.post('/sessions', createSessionContorller.handle)

export { sessionsRoutes }
