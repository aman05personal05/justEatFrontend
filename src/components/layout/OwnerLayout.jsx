import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  UtensilsCrossed,
} from "lucide-react";

const navCls = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-300 dark:hover:text-orange-400 dark:hover:bg-gray-800"
  }`;

export default function OwnerLayout() {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      <aside className="w-56 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <Link
            to="/owner/dashboard"
            className="flex items-center gap-2.5 font-bold text-orange-500 text-xl group"
          >
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            JustEats
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink to="/owner/dashboard" className={navCls}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
          <NavLink to="/owner/menu" className={navCls}>
            <Menu className="w-4 h-4" /> Menu Manager
          </NavLink>
          <NavLink to="/owner/orders" className={navCls}>
            <ClipboardList className="w-4 h-4" /> Orders
          </NavLink>
          <NavLink to="/owner/profile" className={navCls}>
            <User className="w-4 h-4" /> Profile
          </NavLink>
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 shrink-0 space-y-1">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-300 dark:hover:text-orange-400 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
