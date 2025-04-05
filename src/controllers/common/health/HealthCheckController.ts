import { Request, Response } from 'express'
import { HealthCheckService } from '../../../services/common/health/HealthCheckService'

class HealthCheckController {
  async handle(request: Request, response: Response) {
    try {
      const healthCheckService = new HealthCheckService()

      await healthCheckService.execute()

      return response.status(200).json({ status: 'OK' })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { HealthCheckController }
