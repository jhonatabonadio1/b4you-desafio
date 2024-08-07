import { Request, Response } from 'express'

import { UpdateUserVehicleService } from '../services/UpdateUserVehicleService'

class UpdateUserVehicleController {
  async handle(request: Request, response: Response) {
    const { vehicleId } = request.params
    const { categoria, nome, placa } = request.body
    const { userId } = request

    const updateVehicleService = new UpdateUserVehicleService()

    const veiculo = await updateVehicleService.execute({
      vehicleId,
      userId,
      categoria,
      nome,
      placa,
    })

    return response.json(veiculo)
  }
}

export { UpdateUserVehicleController }
