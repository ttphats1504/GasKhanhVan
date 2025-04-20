import express from 'express'
import multer from 'multer'
import {
  addIncentive,
  getAllIncentives,
  getIncentiveById,
  updateIncentive,
  deleteIncentive,
} from '../controllers/incentivesController'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({storage})

router.post('/', upload.single('image'), addIncentive)
router.get('/', getAllIncentives)
router.get('/:id', getIncentiveById)
router.put('/:id', upload.single('image'), updateIncentive)
router.delete('/:id', deleteIncentive)

export default router
