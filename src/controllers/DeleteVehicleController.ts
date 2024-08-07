import { Request, Response } from 'express'

import { DeleteVehicleService } from '../services/DeleteVehicleService'

class DeleteVehicleController {
  async handle(request: Request, response: Response) {
    const { vehicleId } = request.params

    const deleteUserService = new DeleteVehicleService()

    const veiculo = await deleteUserService.execute({
      vehicleId,
    })

    return response.json(veiculo)
  }
}

export { DeleteVehicleController }
