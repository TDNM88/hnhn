import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { authMiddleware, comparePassword, getCurrentUser, hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const authError = await authMiddleware(req, res);
  if (authError) return authError;

  try {
    const { currentPassword, newPassword } = req.body;
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return res.status(401).json({ error: 'Không có quyền truy cập' });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id));

    // Return success
    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi đổi mật khẩu' });
  }
}
