import { Request, Response } from 'express'

import { UpdateVehicleService } from '../services/UpdateVehicleService'

class UpdateVehicleController {
  async handle(request: Request, response: Response) {
    const { vehicleId } = request.params
    const { categoria, nome, placa } = request.body

    const updateVehicleService = new UpdateVehicleService()

    const veiculo = await updateVehicleService.execute({
      vehicleId,
      categoria,
      nome,
      placa,
    })

    return response.json(veiculo)
  }
}

export { UpdateVehicleController }
