"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/generate", label: "Generate", icon: "🤖" },
  { href: "/wardrobe", label: "Wardrobe", icon: "👕" },
  { href: "/cultural", label: "Cultural", icon: "🌍" },
  { href: "/evaluate", label: "Evaluate", icon: "⭐" },
  { href: "/saved", label: "Saved", icon: "❤️" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  // Don't show navbar on auth page
  if (pathname === "/auth") return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2"
          >
            <span>👔</span> StyleSense
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  pathname === item.href
                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="hidden lg:inline">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    user.gender === "male" ? "bg-blue-500" :
                    user.gender === "female" ? "bg-pink-500" : "bg-purple-500"
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 dark:text-white">{user.name.split(" ")[0]}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.gender}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition"
                  title="Logout"
                >
                  🚪
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                pathname === item.href
                  ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
