import {Request, Response} from 'express'
import cloudinary from '../config/cloudinary'
import fs from 'fs'
import Incentive from '../models/IncentiveModel'
import streamifier from 'streamifier'

// Create
export const addIncentive = async (req: Request, res: Response) => {
  try {
    const {name, order} = req.body
    const file = req.file
    let imageUrl = ''

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'incentives',
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

    const newIncentive = await Incentive.create({
      name,
      image: imageUrl,
      order,
    })

    res.status(201).json(newIncentive)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read All
export const getAllIncentives = async (_req: Request, res: Response) => {
  try {
    const incentives = await Incentive.findAll()

    res.status(200).json(incentives)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Read One
export const getIncentiveById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const incentive = await Incentive.findByPk(id)
    if (!incentive) {
      res.status(404).json({message: 'Incentive not found'})
      return
    }
    res.status(200).json(incentive)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update
export const updateIncentive = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const file = req.file
    const existing = await Incentive.findByPk(id)
    if (!existing) {
      res.status(404).json({message: 'Incentive not found'})
      return
    }

    let imageUrl = existing.image
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'incentives',
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
export const deleteIncentive = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Incentive.destroy({where: {id}})
    res.status(200).json({message: 'Incentive deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
