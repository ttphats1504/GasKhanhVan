import express from 'express'
import multer from 'multer'
import {
  addIncentive,
  getAllIncentives,
  getIncentiveById,
  updateIncentive,
  deleteIncentive,
} from '../controllers/incentivesController'
import upload from '../utils/multer'

const router = express.Router()

router.post('/', upload.single('image'), addIncentive)
router.get('/', getAllIncentives)
router.get('/:id', getIncentiveById)
router.put('/:id', upload.single('image'), updateIncentive)
router.delete('/:id', deleteIncentive)

export default router
