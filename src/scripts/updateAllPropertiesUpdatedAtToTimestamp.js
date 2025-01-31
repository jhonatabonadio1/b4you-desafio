/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose')
require('dotenv').config()

// Conexão com MongoDB
const mongoURI = process.env.DATABASE_URL
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'))
db.once('open', () => console.log('Conectado ao MongoDB!'))

// Definição do Schema de Properties
const propertySchema = new mongoose.Schema({
  nome: String,
  timestamp: Date,
  updated_at: Date,
  links: [
    {
      timestamp: Date,
      updated_at: Date,
    },
  ],
})

const Property = mongoose.model('properties', propertySchema)

async function updateProperties() {
  try {
    // Buscar todas as propriedades que possuem `links.updated_at` como null
    const properties = await Property.find({ 'links.updated_at': null })

    for (const property of properties) {
      let updated = false

      // Atualizar os elementos do array `links` onde `updated_at` é null
      property.links = property.links.map((link) => {
        if (link.updated_at === null) {
          link.updated_at = link.timestamp // Define `updated_at` como `timestamp`
          updated = true
        }
        return link
      })

      // Salvar somente se houve alguma alteração
      if (updated) {
        await property.save()
      }
    }

    console.log('Atualização concluída!')
  } catch (error) {
    console.error('Erro ao atualizar propriedades:', error)
  } finally {
    mongoose.connection.close() // Fecha a conexão com o banco
  }
}

// Executa a função
updateProperties()
