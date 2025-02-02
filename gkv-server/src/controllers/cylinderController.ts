import { Request, Response } from 'express';
import Cylinder, { ICylinder } from '../models/CylinderModel';

// Add a new cylinder with image
export const addCylinder = async (req: Request, res: Response) => {
    try {
      const { name, type, price, stock, description } = req.body;
      const image = req.file ? req.file.path : ''; // Path to the uploaded image
  
      const newCylinder: ICylinder = new Cylinder({
        name,
        type,
        price,
        stock,
        image,
        description, // Rich text description
      });
      await newCylinder.save();
  
      res.status(201).json(newCylinder);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

// Get all cylinders
export const getAllCylinders = async (req: Request, res: Response) => {
  try {
    const cylinders = await Cylinder.find();
    res.status(200).json(cylinders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a single cylinder by ID
export const getCylinderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cylinder = await Cylinder.findById(id);

    if (!cylinder) {
      res.status(404).json({ message: "Cylinder not found" });
      return;
    }

    res.status(200).json(cylinder);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a cylinder
export const updateCylinder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCylinder = await Cylinder.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedCylinder);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a cylinder
export const deleteCylinder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Cylinder.findByIdAndDelete(id);
    res.status(200).json({ message: 'Cylinder deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};