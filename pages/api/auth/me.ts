import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { authMiddleware, getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const authError = await authMiddleware(req, res);
  if (authError) return authError;

  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return res.status(401).json({ error: 'Không có quyền truy cập' });
    }

    // Get user from database with updated information
    const user = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    // Return user data (without password)
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        balance: user.balance,
        isVerified: user.isVerified,
        phone: user.phone,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
  }
}
