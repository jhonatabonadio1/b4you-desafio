/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { FetchPlansService } from '../../../services/common/plans/FetchPlansService'

class FetchPlansController {
  async handle(request: Request, response: Response) {
    const fetchPlans = new FetchPlansService()

    try {
      const plans = await fetchPlans.execute()
      return response.status(200).json(plans)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

export { FetchPlansController }
