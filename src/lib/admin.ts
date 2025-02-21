/* eslint-disable @typescript-eslint/ban-ts-comment */
import AdminJS, { AdminJSOptions, ActionRequest } from 'adminjs'
import AdminJSExpress from '@adminjs/express'

// @ts-ignore
import { Database, Resource, getModelByName } from '@adminjs/prisma'

import dotenv from 'dotenv'

import { hash, compare } from 'bcryptjs'
import { prismaClient } from '../database/prismaClient'
import { stripe } from './stripe'

dotenv.config()

// Registra o adapter do Prisma no AdminJS
AdminJS.registerAdapter({ Database, Resource })

async function createDefaultAdminUser() {
  // Utilize variáveis de ambiente para as credenciais padrão
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL!
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD!

  // Verifica se o usuário admin já existe
  const existingUser = await prismaClient.adminUser.findUnique({
    where: { email: defaultEmail },
  })

  // Se não existir, cria o usuário com a senha criptografada
  if (!existingUser) {
    const hashedPassword = await hash(defaultPassword, 10)
    await prismaClient.adminUser.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
      },
    })
    console.log('Usuário admin padrão criado!')
  } else {
    console.log('Usuário admin padrão já existe.')
  }
}

createDefaultAdminUser()

// Configurações do AdminJS
const adminJsOptions: AdminJSOptions = {
  rootPath: '/admin',
  branding: {
    companyName: 'Incorporaê', // Nome da sua marca
    logo: 'https://initechcdn.s3.sa-east-1.amazonaws.com/icon.png', // URL para o seu logotipo
    favicon: 'https://initechcdn.s3.sa-east-1.amazonaws.com/favicon.ico', // URL para o favicon
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: '#000', // Cor primária personalizada
        // Você pode personalizar outras cores conforme necessário
      },
    },
  },

  resources: [
    {
      resource: { model: getModelByName('AdminUser'), client: prismaClient },
      options: {
        properties: {
          password: {
            type: 'password',
          },
        },
        actions: {
          new: {
            before: async (request: ActionRequest) => {
              if (request.payload && request.payload.password) {
                request.payload.password = await hash(
                  request.payload.password,
                  10,
                )
              }
              return request
            },
            edit: {
              before: async (request: ActionRequest) => {
                if (request.payload) {
                  delete request.payload.id // Remove o id antes de enviar para o Prisma
                }
                return request
              },
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('User'), client: prismaClient },
      options: {
        properties: {
          password: {
            type: 'password',
          },
        },
        actions: {
          new: {
            before: async (request: ActionRequest) => {
              if (request.payload && request.payload.password) {
                request.payload.password = await hash(
                  request.payload.password,
                  10,
                )
              }
              return request
            },
          },
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                console.log(request.payload)
                delete request.payload.id // Remove o ID antes de enviar para o Prisma
              }
              return request
            },
          },
          delete: {
            before: async (request: ActionRequest, context: any) => {
              const userId = context?.record?.params.id

              console.log(context)

              if (!userId) {
                throw new Error('Usuário não encontrado.')
              }

              // Buscar usuário no banco de dados
              const user = await prismaClient.user.findUnique({
                where: { id: userId },
              })

              if (!user) {
                throw new Error('Usuário não encontrado no banco de dados.')
              }

              // Se o usuário tiver um stripeCustomerId, excluir do Stripe
              if (user.stripeCustomerId) {
                try {
                  await stripe.customers.del(user.stripeCustomerId)
                  console.log(
                    `Cliente Stripe ${user.stripeCustomerId} removido.`,
                  )
                } catch (error) {
                  console.error('Erro ao remover usuário do Stripe:', error)
                  throw new Error('Erro ao excluir cliente do Stripe.')
                }
              }

              return request
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Subscription'), client: prismaClient },
      options: {
        actions: {
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                delete request.payload.id // Remove o id antes de enviar para o Prisma
              }
              return request
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Plan'), client: prismaClient },
      options: {
        actions: {
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                delete request.payload.id // Remove o id antes de enviar para o Prisma
              }
              return request
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Document'), client: prismaClient },
      options: {
        actions: {
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                delete request.payload.id // Remove o id antes de enviar para o Prisma
              }
              return request
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Blacklist'), client: prismaClient },
      options: {
        actions: {
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                delete request.payload.id // Remove o id antes de enviar para o Prisma
              }
              return request
            },
          },
        },
      },
    },
    {
      resource: {
        model: getModelByName('CheckoutSession'),
        client: prismaClient,
      },
      options: {
        actions: {
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                delete request.payload.id // Remove o id antes de enviar para o Prisma
              }
              return request
            },
          },
        },
      },
    },
    {
      resource: {
        model: getModelByName('Payment'),
        client: prismaClient,
      },
      options: {
        actions: {
          edit: {
            before: async (request: ActionRequest) => {
              if (request.payload) {
                delete request.payload.id // Remove o id antes de enviar para o Prisma
              }
              return request
            },
          },
        },
      },
    },
  ],
}

export const adminJs = new AdminJS(adminJsOptions)

// Configuração da rota autenticada do AdminJS
export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email: string, password: string) => {
    const adminUser = await prismaClient.adminUser.findUnique({
      where: { email },
    })
    if (adminUser && (await compare(password, adminUser.password))) {
      return adminUser
    }
    return null
  },
  cookiePassword: 'ff2c2ad99df6f0d0aec6af9d38518bbf487bdeed', // Use uma senha forte para o cookie
})
