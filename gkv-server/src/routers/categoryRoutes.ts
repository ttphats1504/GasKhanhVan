import express from 'express'
import multer from 'multer'
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({storage})

router.post('/', upload.single('image'), addCategory)
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.put('/:id', upload.single('image'), updateCategory)
router.delete('/:id', deleteCategory)

export default router
