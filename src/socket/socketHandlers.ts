// src/socket/socketHandlers.ts
import { Server, Socket } from 'socket.io'
import { CreatePageViewService } from '../services/common/tracking/CreatePageViewService'
import { isOwnerOfDocument } from './authSocket'

// Estrutura interna para guardar infos temporárias de cada socket
interface SocketContext {
  sessionId?: string
  documentId?: string
  fingerprint?: string
  network?: string
  lastPage: number | null
  lastPageTime: number
  pageViews: Array<{
    pageNumber: number
    interactionTime: number
  }>
}

/**
 * Ao registrar handlers, instanciamos um "contexto" para cada socket.
 */
export function registerSocketHandlers(io: Server, socket: Socket) {
  // "Armazenamos" infos sobre a sessão do usuário nesse objeto
  const ctx: SocketContext = {
    lastPage: null,
    lastPageTime: Date.now(),
    pageViews: [],
  }

  // Qualquer um pode chamar "joinDocumentRoom" para ver o doc
  socket.on(
    'joinDocumentRoom',
    (data: { documentId: string; sessionId: string; fingerprint?: string }) => {
      const { documentId, sessionId, fingerprint } = data
      ctx.documentId = documentId
      ctx.sessionId = sessionId
      ctx.fingerprint = fingerprint ?? ''
      ctx.network = socket.handshake.address // ex.: IP

      // Entra na sala do doc
      socket.join(`document:${documentId}`)

      broadcastActiveUsersToOwner(io, ctx.documentId)

      console.log(
        `[Socket.io] Socket ${socket.id} => entrou em document:${documentId}`,
      )
    },
  )

  // Quando mudar de página, atualizamos "pageViews"
  socket.on('pageChange', (data: { pageNumber: number }) => {
    const { pageNumber } = data
    trackPageTime(ctx, pageNumber) // atualiza "pageViews" local
  })

  socket.on(
    'joinDocumentOwnerRoom',
    (data: { documentId: string; token: string }) => {
      const { documentId, token } = data

      // Checa se realmente é dono
      const isOwner = isOwnerOfDocument(token, documentId)
      if (!isOwner) {
        // se não for dono, não entra
        return
      }

      // Cria uma sala exclusiva de donos (pode ser um único dono ou vários)
      socket.join(`docOwner:${documentId}`)

      // Emite a contagem atual de cara
      broadcastActiveUsersToOwner(io, documentId)
    },
  )

  async function broadcastActiveUsersToOwner(io: Server, documentId: string) {
    const socketsInRoom = await io.in(`document:${documentId}`).fetchSockets()
    const count = socketsInRoom.length

    // Avisa a sala de "dono" que a contagem mudou
    io.to(`docOwner:${documentId}`).emit('activeUsersCount', {
      documentId,
      count,
    })
  }

  // Ao desconectar, salvamos o tempo na última página
  socket.on('disconnect', async () => {
    if (ctx.lastPage !== null) {
      trackPageTime(ctx, ctx.lastPage) // finaliza tempo
    }

    // Salvar no banco
    if (ctx.documentId && ctx.sessionId) {
      broadcastActiveUsersToOwner(io, ctx.documentId)

      const createPageViewService = new CreatePageViewService()
      try {
        console.log(ctx.sessionId)
        await createPageViewService.execute({
          sessionId: ctx.sessionId,
          fingerprint: ctx.fingerprint || '',
          network: ctx.network,
          pageViews: ctx.pageViews,
        })
      } catch (error) {
        console.log(error)
      }
    }

    console.log(`[Socket.io] Socket ${socket.id} desconectou.`)
  })
}

/**
 * Lógica para computar tempo de permanência em cada página.
 */
function trackPageTime(ctx: SocketContext, newPageNumber: number) {
  const now = Date.now()
  if (ctx.lastPage !== null) {
    const timeSpentSec = (now - ctx.lastPageTime) / 1000

    // Verifica se já existe a page no array
    const existing = ctx.pageViews.find((pv) => pv.pageNumber === ctx.lastPage)
    if (existing) {
      existing.interactionTime += timeSpentSec
    } else {
      ctx.pageViews.push({
        pageNumber: ctx.lastPage,
        interactionTime: timeSpentSec,
      })
    }
  }

  ctx.lastPage = newPageNumber
  ctx.lastPageTime = now
}
