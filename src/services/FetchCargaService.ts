import { prismaClient } from '../database/prismaClient'

class FetchCargaService {
  async execute() {
    const fetchCarga = await prismaClient.carga.findMany({
      where: { deleted: false },
      orderBy: {
        created_at: 'desc',
      },
    })

    return {
      cargas: fetchCarga,
      atual: fetchCarga[0] ? fetchCarga[0].id : null,
    }
  }
}

export { FetchCargaService }
