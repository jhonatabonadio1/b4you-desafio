/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose')
require('dotenv').config()

// Substitua pela sua URL do MongoDB
const mongoURI = process.env.DATABASE_URL

// Conectando ao MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'))
db.once('open', () => console.log('Conectado ao MongoDB!'))

// Definição do Schema do Usuário
const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  deleted: { type: Boolean, default: false },
})

// Criando o modelo
const User = mongoose.model('users', userSchema)

async function updateAndListUsers() {
  try {
    // Atualiza usuários onde `deleted` está `null`, definindo como `false`
    await User.updateMany({ deleted: null }, { deleted: false })

    // Busca usuários onde `deleted` seja `false`
    const users = await User.find({ deleted: false })

    console.log('Usuários ativos:', users)
  } catch (error) {
    console.error('Erro ao atualizar/listar usuários:', error)
  } finally {
    mongoose.connection.close() // Fecha a conexão com o banco
  }
}

// Executa a função
updateAndListUsers()
