import { Request, Response } from 'express'
import { MonitorHealthService } from '../../../services/common/health/MonitorHealthService'

class MonitorHealthController {
  async handle(request: Request, response: Response) {
    try {
      const monitorHealthService = new MonitorHealthService()

      const monitor = await monitorHealthService.execute()

      return response.status(200).render('monitor', monitor)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { MonitorHealthController }
