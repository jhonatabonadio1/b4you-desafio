import multer from 'multer'
import path from 'path'

// Configura o multer para salvar o arquivo em uma pasta temporária
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/', // Pasta temporária
    filename: (req, file, cb) => {
      // Extrai a extensão do arquivo original
      const ext = path.extname(file.originalname)

      // Garante que o arquivo seja salvo com a extensão correta
      cb(null, `${file.fieldname}-${Date.now()}${ext}`)
    },
  }),
})

export { upload }
