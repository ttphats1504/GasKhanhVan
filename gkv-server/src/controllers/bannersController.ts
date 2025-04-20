import {Request, Response} from 'express'
import Banner from '../models/BannerModel'
import cloudinary from '../config/cloudinary'
import fs from 'fs'

// Create
export const addBanner = async (req: Request, res: Response) => {
  try {
    const file = req.file
    let imageUrl = ''

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'banners',
        use_filename: true,
      })
      imageUrl = result.secure_url
      fs.unlinkSync(file.path)
    }

    const newBanner = await Banner.create({
      image: imageUrl,
    })

    res.status(201).json(newBanner)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read All
export const getAllBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await Banner.findAll()
    res.status(200).json(banners)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read One
export const getBannerById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const banner = await Banner.findByPk(id)
    if (!banner) {
      res.status(404).json({message: 'Banner not found'})
      return
    }
    res.status(200).json(banner)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const file = req.file
    const existing = await Banner.findByPk(id)

    if (!existing) {
      res.status(404).json({message: 'Banner not found'})
      return
    }

    let imageUrl = existing.image
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'banners',
        use_filename: true,
      })
      imageUrl = result.secure_url
      fs.unlinkSync(file.path)
    }

    await existing.update({...req.body, image: imageUrl})
    res.status(200).json(existing)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Delete
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Banner.destroy({where: {id}})
    res.status(200).json({message: 'Banner deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
