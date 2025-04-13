import {Request, Response} from 'express'
import Cylinder, {ICylinder} from '../models/CylinderModel'
import cloudinary from '../config/cloudinary'
import fs from 'fs'

// Add a new cylinder with image
export const addCylinder = async (req: Request, res: Response) => {
  try {
    const {name, type, price, stock, description} = req.body
    const file = req?.file
    const image = req.file ? req.file.path : '' // Path to the uploaded image

    const newCylinder: ICylinder = new Cylinder({
      name,
      type,
      price,
      stock,
      image,
      description, // Rich text description
    })
    await newCylinder.save()

    // Step 2: Upload Image to Cloudinary
    let imageUrl = ''
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'cylinders', // Save images inside a "cylinders" folder
        use_filename: true,
      })

      imageUrl = result.secure_url // Get public Cloudinary URL

      // Step 3: Update Cylinder with Image URL
      newCylinder.image = imageUrl
      await newCylinder.save()

      // Delete local file after upload
      fs.unlinkSync(file.path)
    }

    res.status(201).json(newCylinder)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Get all cylinders
export const getAllCylinders = async (req: Request, res: Response) => {
  try {
    const cylinders = await Cylinder.find()
    res.status(200).json(cylinders)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Get a single cylinder by ID
export const getCylinderById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const cylinder = await Cylinder.findById(id)

    if (!cylinder) {
      res.status(404).json({message: 'Cylinder not found'})
      return
    }

    res.status(200).json(cylinder)
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}

// Update a cylinder
export const updateCylinder = async (req: Request, res: Response) => {
  try {
    console.log('🔍 Request Params:', req.params)
    console.log('📝 Request Body:', req.body)

    const {id} = req.params
    const file = req.file // Get uploaded file (if any)

    // Find the existing cylinder
    const existingCylinder = await Cylinder.findById(id)
    if (existingCylinder) {
      let imageUrl = existingCylinder.image // Keep old image if no new one is uploaded

      if (file) {
        console.log('📸 New Image File:', file.originalname)

        // ✅ Upload new image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'cylinders', // Store in "cylinders" folder
          use_filename: true,
        })
        imageUrl = uploadResult.secure_url // Get Cloudinary URL

        // ✅ Delete old image from Cloudinary (if exists)
        if (existingCylinder.image) {
          const oldImagePublicId = existingCylinder.image.split('/').pop()?.split('.')[0] // Extract public ID
          if (oldImagePublicId) {
            await cloudinary.uploader.destroy(`cylinders/${oldImagePublicId}`)
          }
        }

        // ✅ Delete local file
        fs.unlinkSync(file.path)
      }

      // ✅ Update cylinder in the database
      const updatedCylinder = await Cylinder.findByIdAndUpdate(
        id,
        {...req.body, image: imageUrl}, // Update all fields + new image URL
        {new: true, runValidators: true} // Return updated document
      )

      console.log('✅ Updated Cylinder:', updatedCylinder)

      res.status(200).json(updatedCylinder)
    }
  } catch (err) {
    console.error('❌ Error updating cylinder:', err)
    res.status(500).json({error: (err as Error).message})
  }
}

// Delete a cylinder
export const deleteCylinder = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    await Cylinder.findByIdAndDelete(id)
    res.status(200).json({message: 'Cylinder deleted successfully'})
  } catch (err) {
    res.status(500).json({error: (err as Error).message})
  }
}
