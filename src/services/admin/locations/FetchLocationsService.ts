import { prismaClient } from '../../../database/prismaClient'

class FetchLocationsService {
  async execute() {
    const locations = await prismaClient.locations.findMany()

    if (!locations || locations.length === 0) {
      throw new Error('Nenhuma localização encontrada.')
    }

    return locations
  }
}

export { FetchLocationsService }
