import { Request, Response } from 'express'

import { DeleteUserVehicleService } from '../services/DeleteUserVehicleService'

class DeleteUserVehicleController {
  async handle(request: Request, response: Response) {
    const { vehicleId } = request.params
    const { userId } = request

    const deleteUserService = new DeleteUserVehicleService()

    const veiculo = await deleteUserService.execute({
      userId,
      vehicleId,
    })

    return response.json(veiculo)
  }
}

export { DeleteUserVehicleController }
