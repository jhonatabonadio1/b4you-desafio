/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { FetchPlansAuthService } from '../../../services/common/plans/FetchPlansAuthService'

class FetchPlansAuthController {
  async handle(request: Request, response: Response) {
    const { userId } = request
    const fetchPlans = new FetchPlansAuthService()

    try {
      const plans = await fetchPlans.execute(userId)
      return response.status(200).json(plans)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchPlansAuthController }
