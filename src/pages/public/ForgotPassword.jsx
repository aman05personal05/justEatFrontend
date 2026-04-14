import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { ArrowLeft, UtensilsCrossed, Moon, Sun } from "lucide-react";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const inputCls =
  "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all";

export default function ForgotPassword() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [sent, setSent] = useState(false);
  const [debugToken, setDebugToken] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      const { data } = await authApi.forgotPassword(email);
      setSent(true);
      // Dev mode: backend returns the token directly when DEBUG=true
      if (data.reset_token) setDebugToken(data.reset_token);
      toast.success("Reset instructions sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
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
            Reset Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">
            Enter your email and we'll send reset instructions
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-700 dark:text-green-400 text-sm text-center">
              If that email is registered, you will receive reset instructions
              shortly.
            </div>

            {/* Dev mode helper — shows reset URL for testing without email */}
            {debugToken && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-xs space-y-2">
                <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                  🛠 Dev Mode — Reset Token
                </p>
                <p className="text-yellow-700 dark:text-yellow-500 break-all font-mono">
                  {debugToken}
                </p>
                <Link
                  to={`/reset-password?token=${debugToken}`}
                  className="inline-block text-orange-600 dark:text-orange-400 underline font-medium"
                >
                  Click here to reset password →
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              <Link
                to="/login"
                className="text-orange-500 font-semibold hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
