// src/controllers/uploadController.ts
import {Request, Response} from 'express'
import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({error: 'No file uploaded'})
    } else {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {folder: 'blogs/content', use_filename: true},
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })

      // Quill yêu cầu trả về link ảnh
      res.json({url: (result as any).secure_url})
    }
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
