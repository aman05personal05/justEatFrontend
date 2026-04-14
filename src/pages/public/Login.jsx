import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { UtensilsCrossed, Moon, Sun } from "lucide-react";
import FormField from "../../components/ui/FormField";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
});

const inputCls =
  "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all";

export default function Login() {
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    try {
      const decoded = await login(email, password);
      toast.success("Welcome back!");
      navigate(decoded.role === "owner" ? "/owner/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-all"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-2xl mb-4 shadow-lg shadow-orange-500/25">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in to JustEats
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={inputCls}
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-semibold hover:text-orange-600 dark:hover:text-orange-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
