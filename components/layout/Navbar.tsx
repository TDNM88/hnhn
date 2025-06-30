import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            London SSI
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/trade" className="hover:text-blue-400">
              Giao dịch
            </Link>
            <Link href="/dashboard" className="hover:text-blue-400">
              Bảng điều khiển
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="hover:text-blue-400">
                Quản trị
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm">
                Xin chào, {user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-white border-white hover:bg-blue-700"
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-blue-700 mr-2"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
