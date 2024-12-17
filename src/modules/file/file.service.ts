import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import * as Minio from 'minio'
import { IFile } from '@/commons/interfaces'

@Injectable()
export class FileService {
  private minioClient: Minio.Client
  private bucket: string

  constructor() {
    this.bucket = process.env.MINIO_PATH_BUCKET
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true' ? true : false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      region: 'us-east-1',
    })

    this._checkBucketExistence()
  }

  private async _checkBucketExistence() {
    if (process.env.USE_MINIO !== String(1)) return

    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucket)
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucket)
      }
    } catch (err) {
      throw new BadRequestException('Error checking bucket existence')
    }
  }

  private _getPublicUrl(fileName: string): string {
    const protocol = this.minioClient['protocol'] || 'http:'
    const host = this.minioClient['host']
    const port = this.minioClient['port']
    return `${protocol}//${host}/${this.bucket}/${fileName}`
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<IFile[]> {
    const fileInfos: IFile[] = []

    try {
      for (const file of files) {
        const metaData = { 'Content-Type': file.mimetype }
        const { originalname: fileName, buffer, size, mimetype } = file
        await this.minioClient.putObject(this.bucket, fileName, buffer, size, metaData)

        const extension = fileName.split('.').pop()

        fileInfos.push({
          name: fileName,
          size: size,
          mimeType: mimetype,
          extension: extension,
          url: this._getPublicUrl(fileName),
        })
      }

      return fileInfos
    } catch (error) {
      throw new BadRequestException(error, 'Error during file upload')
    }
  }

  async downloadFile(fileName: string, response: Response): Promise<void> {
    try {
      const stat = await this.minioClient.statObject(this.bucket, fileName)
      const { size, metaData } = stat

      response.writeHead(200, {
        ...metaData,
        'Content-Type': 'application/octet-stream',
        'Accept-Ranges': 'bytes',
        'Content-Length': size,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Meta': JSON.stringify(metaData),
      })

      const dataStream = await this.minioClient.getObject(this.bucket, fileName)
      dataStream.pipe(response)

      dataStream.on('error', err => new Error(err.message))
    } catch (err) {
      if (err.code === 'NoSuchKey') throw new NotFoundException('File not found')
      throw new Error(err)
    }
  }

  getPresignedUrl(fileName: string): string {
    // TODO: Return file image not string
    return this._getPublicUrl(fileName)
  }
}
