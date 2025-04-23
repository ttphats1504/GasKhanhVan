import {Request, Response} from 'express'
import Product from '../models/ProductModel'
import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'

// Create
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {name, typeId, price, stock, description} = req.body
    const file = req.file
    let imageUrl = ''

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )

        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })

      imageUrl = (result as any).secure_url
    }

    const newProduct = await Product.create({
      name,
      typeId,
      price,
      stock,
      description,
      image: imageUrl,
    })

    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read All
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll()

    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read One
export const getProductById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const product = await Product.findByPk(id)
    if (!product) {
      res.status(404).json({message: 'Product not found'})
      return
    }
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const file = req.file
    const existing = await Product.findByPk(id)
    if (!existing) {
      res.status(404).json({message: 'Product not found'})
      return
    }

    let imageUrl = existing.image
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )

        streamifier.createReadStream(file.buffer).pipe(uploadStream)
      })

      imageUrl = (result as any).secure_url
    }

    await existing.update({...req.body, image: imageUrl})
    res.status(200).json(existing)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Delete
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Product.destroy({where: {id}})
    res.status(200).json({message: 'Product deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
