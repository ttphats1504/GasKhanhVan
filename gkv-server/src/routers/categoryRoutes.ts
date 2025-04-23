import express from 'express'
import multer from 'multer'
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController'
import upload from '../utils/multer'

const router = express.Router()

router.post('/', upload.single('image'), addCategory)
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.put('/:id', upload.single('image'), updateCategory)
router.delete('/:id', deleteCategory)

export default router
