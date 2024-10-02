import { Request, Response } from 'express'
import { CreateVehicleService } from '../services/CreateVehicleService'

class CreateVehicleController {
  async handle(request: Request, response: Response) {
    const { nome, placa, categoria, marca, modelo } = request.body

    const { userId } = request

    const createVeiculoService = new CreateVehicleService()

    const veiculo = await createVeiculoService.execute({
      nome,
      placa,
      marca,
      modelo,
      categoria,
      userId,
    })

    return response.json(veiculo)
  }
}

export { CreateVehicleController }
