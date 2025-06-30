import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  role: string;
  balance: number;
  isVerified: boolean;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      setUser(data.user);
      // Redirect to dashboard after login
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Đăng nhập thất bại');
      }
      throw new Error('Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, password: string, email?: string, name?: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/register', { username, password, email, name });
      // Don't automatically log in after registration
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Đăng ký thất bại');
      }
      throw new Error('Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Đổi mật khẩu thất bại');
      }
      throw new Error('Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
