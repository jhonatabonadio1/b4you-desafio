/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb')

async function updateNullOpcoesAdicionais() {
  const uri =
    'mongodb+srv://assecamti:755VsC5lSyRZLqAd@assecam-cluster.i9aawvq.mongodb.net/assecam-cluster?retryWrites=true&w=majority&appName=assecam-cluster' // Substitua pela URI do MongoDB
  const client = new MongoClient(uri)

  try {
    console.log('Conectando ao banco de dados...')
    await client.connect()

    const db = client.db('assecam-cluster') // Substitua pelo nome do seu banco de dados
    const collection = db.collection('servicos') // Nome da coleção

    console.log('Atualizando registros com opcoesAdicionais nulos...')

    // Atualiza todos os registros onde `opcoesAdicionais` é null
    const result = await collection.updateMany(
      { opcoesAdicionais: null }, // Filtro: apenas registros com `opcoesAdicionais` nulo
      { $set: { opcoesAdicionais: '[]' } }, // Atualiza o campo para a string JSON vazia
    )

    console.log(
      `Atualização concluída. Registros modificados: ${result.modifiedCount}`,
    )
  } catch (error) {
    console.error('Erro ao atualizar registros:', error)
  } finally {
    await client.close()
    console.log('Conexão com o banco de dados encerrada.')
  }
}

updateNullOpcoesAdicionais()
