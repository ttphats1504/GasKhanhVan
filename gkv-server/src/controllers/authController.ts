import { Request, Response } from 'express';
import { mysqlDB } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface GoogleLoginBody {
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  uid: string;
}

// Google Login
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { name, email, photoUrl, uid }: GoogleLoginBody = req.body;

    if (!email || !uid) {
      return res.status(400).json({
        success: false,
        message: 'Email and UID are required',
      });
    }

    // Check if email is in admin whitelist
    const [adminUsers] = await mysqlDB.query<RowDataPacket[]>(
      'SELECT * FROM admin_users WHERE email = ? AND is_active = true',
      [email]
    );

    if (adminUsers.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your email is not authorized to access this admin panel.',
      });
    }

    const adminUser = adminUsers[0];

    // Check if user exists
    const [existingUsers] = await mysqlDB.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? OR firebase_uid = ?',
      [email, uid]
    );

    let user;

    if (existingUsers.length > 0) {
      // User exists, update info
      user = existingUsers[0];

      await mysqlDB.query(
        'UPDATE users SET name = ?, photo_url = ?, firebase_uid = ?, last_login = NOW() WHERE id = ?',
        [name, photoUrl, uid, user.id]
      );

      user.name = name;
      user.photo_url = photoUrl;
      user.firebase_uid = uid;
    } else {
      // Create new user
      const [result] = await mysqlDB.query(
        'INSERT INTO users (name, email, photo_url, firebase_uid, created_at, last_login) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name, email, photoUrl, uid]
      );

      const insertId = (result as any).insertId;

      const [newUsers] = await mysqlDB.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [insertId]
      );

      user = newUsers[0];
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: uid, // Using Firebase UID as token
        user: {
          uid: user.firebase_uid,
          email: user.email,
          displayName: user.name,
          photoURL: user.photo_url,
          role: adminUser.role, // Include admin role
        },
      },
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Regular Login (optional - for email/password login)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // For now, just return error - implement proper password auth later
    return res.status(401).json({
      success: false,
      message: 'Email/password login not implemented. Please use Google login.',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

