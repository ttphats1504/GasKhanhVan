import express from 'express';
import {
  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../controllers/adminUsersController';

const router = express.Router();

// Get all admin users
router.get('/', getAdminUsers);

// Add new admin user
router.post('/', addAdminUser);

// Update admin user
router.put('/:id', updateAdminUser);

// Delete admin user
router.delete('/:id', deleteAdminUser);

export default router;

