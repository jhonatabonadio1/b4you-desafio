import { prismaClient } from '../database/prismaClient'

interface IUser {
  page: number
  search?: string
}

function exclude<Prestador, Key extends keyof Prestador>(
  user: Prestador,
  keys: Key[],
): Omit<Prestador, Key> {
  const userCopy = { ...user }
  keys.forEach((key) => delete userCopy[key])
  return userCopy
}

class FetchUsersService {
  async execute({ page, search }: IUser, pageSize = 10) {
    const baseWhere = { deleted: false }
    const searchWhere = search
      ? {
          AND: [
            { deleted: false },
            {
              OR: [
                { phone: { contains: search, mode: 'insensitive' as const } },
                { nome: { contains: search, mode: 'insensitive' as const } },
                {
                  matricula: { equals: search, mode: 'insensitive' as const },
                },
                { email: { contains: search, mode: 'insensitive' as const } },
                {
                  cpf: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
              ],
            },
          ],
        }
      : baseWhere

    const totalUsers = await prismaClient.usuario.count({
      where: searchWhere,
    })
    const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1)
    page = Math.min(Math.max(page, 1), totalPages)

    const users = await prismaClient.usuario.findMany({
      where: searchWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: 'desc' },
    })

    const usersWithoutPassword = users.map((user) =>
      exclude(user, ['password']),
    )

    return {
      users: usersWithoutPassword,
      currentPage: page,
      totalPages,
      totalUsers,
    }
  }
}

export { FetchUsersService }
