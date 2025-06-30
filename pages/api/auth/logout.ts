import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the auth cookie by setting an expired date
    const cookie = serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Expired
      path: '/',
    });

    // Set cookie header
    res.setHeader('Set-Cookie', cookie);

    // Return success
    return res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng xuất' });
  }
}
