import { Request, Response } from 'express'
import { uploadQueue } from '../../../lib/uploadQueue'

interface FileProps {
  id: string
  state: string
  result?: any
}

export class CheckUploadStatusBatchController {
  async handle(req: Request, res: Response) {
    try {
      const { jobIds } = req.body

      const results = [] as FileProps[]

      for (const id of jobIds) {
        const job = await uploadQueue.getJob(id)
        if (!job) {
          results.push({
            id,
            state: 'not_found',
            result: [],
          })
          continue
        }

        const state = await job.getState()

        let jobResult

        if (state === 'completed') {
          jobResult = await job.returnvalue
        }

        // Monta objeto de resposta para este jobId
        results.push({
          id,
          state,
          result: jobResult,
        })
      }

      // Retorna o objeto contendo o status de cada jobId
      return res.json(results)
    } catch (error) {
      console.error('Erro ao verificar status dos jobs:', error)
      return res
        .status(500)
        .json({ error: 'Erro interno ao verificar status dos jobs' })
    }
  }
}
