import { Request, Response } from 'express';
import { mysqlDB } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

// Get all admin users
export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    const [adminUsers] = await mysqlDB.query<RowDataPacket[]>(
      'SELECT id, email, role, is_active, created_at, updated_at FROM admin_users ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      data: adminUsers,
    });
  } catch (error: any) {
    console.error('Get admin users error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Add new admin user
export const addAdminUser = async (req: Request, res: Response) => {
  try {
    const { email, role = 'admin' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Check if email already exists
    const [existing] = await mysqlDB.query<RowDataPacket[]>(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists in admin list',
      });
    }

    // Insert new admin user
    await mysqlDB.query(
      'INSERT INTO admin_users (email, role, is_active) VALUES (?, ?, true)',
      [email, role]
    );

    return res.status(201).json({
      success: true,
      message: 'Admin user added successfully',
    });
  } catch (error: any) {
    console.error('Add admin user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update admin user
export const updateAdminUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (role) {
      updates.push('role = ?');
      values.push(role);
    }

    if (typeof is_active === 'boolean') {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    values.push(id);

    await mysqlDB.query(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return res.status(200).json({
      success: true,
      message: 'Admin user updated successfully',
    });
  } catch (error: any) {
    console.error('Update admin user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Delete admin user
export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await mysqlDB.query('DELETE FROM admin_users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Admin user deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete admin user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

