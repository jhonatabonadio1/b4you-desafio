import { prismaClient } from '../../../database/prismaClient'

class HealthCheckService {
  async execute() {
    const campaing = await prismaClient.campaing.findFirst()

    return campaing
  }
}

export { HealthCheckService }
