import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import {
  Home,
  LogOut,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  UtensilsCrossed,
  User,
} from "lucide-react";

const navCls = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-300 dark:hover:text-orange-400 dark:hover:bg-gray-800"
  }`;

export default function CustomerLayout() {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { cartCounts } = useCart();
  const navigate = useNavigate();

  const cartItemCount = Object.values(cartCounts).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-orange-500 text-xl group"
          >
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">JustEat</span>
          </Link>

          <div className="flex items-center gap-1">
            <NavLink to="/" end className={navCls}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>

            <NavLink to="/cart" className={navCls}>
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </NavLink>

            <NavLink to="/orders" className={navCls}>
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </NavLink>

            <NavLink to="/profile" className={navCls}>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </NavLink>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-gray-800 transition-all duration-200 ml-1"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 ml-1 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
