"use client"

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không quá 100 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { toast } = useToast();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      await registerUser(data.username, data.password)
      
      // Show success message and redirect to login page after 2 seconds
      toast({
        title: 'Đăng ký thành công!',
        description: 'Vui lòng kiểm tra email để xác thực tài khoản. Bạn sẽ được chuyển hướng về trang đăng nhập.',
      })
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout title="Đăng ký tài khoản - London SSI">      
      <div className="flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Tạo tài khoản mới</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Tên đăng nhập *
                </Label>
                <Input
                  id="username"
                  placeholder="Tên đăng nhập"
                  className="bg-gray-700 border-gray-600 text-white"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Mật khẩu *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu"
                  className="bg-gray-700 border-gray-600 text-white"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Xác nhận mật khẩu *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="bg-gray-700 border-gray-600 text-white"
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-10 mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
