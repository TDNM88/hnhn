import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// User interface
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

// Generate JWT token
export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Authentication middleware for API routes
export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, requiredRole?: string) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Không có token xác thực' });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    
    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại' });
    }
    
    // Check role if required
    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    
    // Attach user to request
    (req as any).user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
    
    return null; // No error, continue
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Lỗi xác thực' });
  }
};

// Get current user from request
export const getCurrentUser = (req: NextApiRequest): AuthUser | null => {
  return (req as any).user || null;
};
