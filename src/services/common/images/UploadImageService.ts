import AWS from 'aws-sdk'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'

class UploadImageService {
  private s3: AWS.S3

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
  }

  async optimizeAndUpload(
    filePath: string,
    originalName: string,
  ): Promise<string> {
    if (!originalName) {
      throw new Error('O nome do arquivo não pode ser nulo')
    }

    const fileName = `${uuidv4()}_${originalName}`

    const buffer = await sharp(filePath)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer()

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    }

    const uploadResult = await this.s3.upload(uploadParams).promise()

    await fs.unlink(filePath)

    return uploadResult.Location
  }
}

export { UploadImageService }
