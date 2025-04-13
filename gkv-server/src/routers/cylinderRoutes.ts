import {Router} from 'express'

import {
  addCylinder,
  getAllCylinders,
  updateCylinder,
  deleteCylinder,
  getCylinderById,
} from '../controllers/cylinderController'
import upload from '../utils/multer'

const router = Router()
// Cylinder routes
router.post('/', upload.single('image'), addCylinder)
router.get('/', getAllCylinders)
router.get('/:id', getCylinderById)
router.put('/:id', upload.single('image'), updateCylinder)
router.delete('/:id', deleteCylinder)

export default router
