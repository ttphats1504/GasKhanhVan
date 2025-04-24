import {Request, Response} from 'express'
import Category from '../models/CategoryModel'
import cloudinary from '../config/cloudinary'
import streamifier from 'streamifier'

// Create
export const addCategory = async (req: Request, res: Response) => {
  try {
    const {name, slug} = req.body
    const file = req.file
    let imageUrl = ''

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'categories',
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

    const newCategory = await Category.create({
      name,
      image: imageUrl,
      slug: slug,
    })

    res.status(201).json(newCategory)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read All
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.findAll()

    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read One
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const category = await Category.findByPk(id)
    if (!category) {
      res.status(404).json({message: 'Category not found'})
      return
    }
    res.status(200).json(category)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const file = req.file
    const existing = await Category.findByPk(id)
    if (!existing) {
      res.status(404).json({message: 'Category not found'})
      return
    }

    let imageUrl = existing.image
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'categories',
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
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Category.destroy({where: {id}})
    res.status(200).json({message: 'Category deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read by Slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const {slug} = req.params
    const category = await Category.findOne({where: {slug}})

    console.log(category)
    if (!category) {
      res.status(404).json({message: 'Category not found'})
    }

    res.status(200).json(category)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
