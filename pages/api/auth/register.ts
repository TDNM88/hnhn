import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password, email, name } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // Check if username already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingEmail) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await db.insert(users).values({
      username,
      password: hashedPassword,
      email: email || `${username}@example.com`, // Fallback email if not provided
      name: name || username,
      role: 'user',
      balance: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: users.id });

    // Return success
    return res.status(201).json({
      message: 'Đăng ký thành công',
      userId: result[0].id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng ký' });
  }
}
