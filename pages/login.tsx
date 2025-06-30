"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Layout from "../components/layout/Layout"

const formSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

type FormValues = z.infer<typeof formSchema>

export default function Login() {
  const { toast } = useToast()
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      await login(values.username, values.password)
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đăng nhập thất bại. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout title="Đăng nhập - London SSI">
      <div className="flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Đăng nhập tài khoản</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
                Đăng ký ngay
              </Link>
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Tên đăng nhập
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
                  Mật khẩu
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-10 mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
