import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { profileApi } from "../../api/profile";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Lock, User } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import FormField from "../../components/ui/FormField";

const profileSchema = yup.object({
  full_name: yup.string().max(200, "Max 200 characters"),
  phone: yup.string().max(20, "Max 20 characters"),
  dietary_restrictions: yup.string().max(500, "Max 500 characters"),
  favourite_cuisine: yup.string().max(200, "Max 200 characters"),
});

const passwordSchema = yup.object({
  current_password: yup.string().required("Current password is required"),
  new_password: yup
    .string()
    .min(8, "At least 8 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Please confirm password"),
});

const inputCls =
  "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all";

export default function Profile() {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ resolver: yupResolver(profileSchema) });

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: isChangingPwd },
  } = useForm({ resolver: yupResolver(passwordSchema) });

  useEffect(() => {
    profileApi
      .get()
      .then(({ data }) => reset(data))
      .catch(() => toast.error("Failed to load profile"));
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      const { data } = await profileApi.update(values);
      reset(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onChangePassword = async ({ current_password, new_password }) => {
    try {
      await authApi.changePassword(current_password, new_password);
      toast.success("Password changed successfully!");
      resetPwd();
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
          <User className="w-6 h-6 text-orange-500" />
        </div>
        My Profile
      </h1>

      {/* Profile form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-5">
          Personal Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email">
            <input
              value={user?.email ?? ""}
              readOnly
              className={`${inputCls} bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed`}
            />
          </FormField>

          <FormField label="Full Name" error={errors.full_name?.message}>
            <input
              {...register("full_name")}
              placeholder="Jane Doe"
              className={inputCls}
            />
          </FormField>

          <FormField label="Phone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              placeholder="+44 7700 000000"
              className={inputCls}
            />
          </FormField>

          <FormField
            label="Dietary Restrictions"
            error={errors.dietary_restrictions?.message}
          >
            <textarea
              {...register("dietary_restrictions")}
              rows={2}
              placeholder="e.g. Vegetarian, nut allergy…"
              className={`${inputCls} resize-none`}
            />
          </FormField>

          <FormField
            label="Favourite Cuisine"
            error={errors.favourite_cuisine?.message}
          >
            <input
              {...register("favourite_cuisine")}
              placeholder="e.g. Italian, Thai…"
              className={inputCls}
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowPasswordForm((v) => !v)}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Lock className="w-4 h-4 text-orange-500" /> Change Password
          </span>
          {showPasswordForm ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={handlePwdSubmit(onChangePassword)}
            className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4"
          >
            <FormField
              label="Current Password"
              error={pwdErrors.current_password?.message}
            >
              <input
                {...registerPwd("current_password")}
                type="password"
                placeholder="••••••••"
                className={inputCls}
              />
            </FormField>
            <FormField
              label="New Password"
              error={pwdErrors.new_password?.message}
            >
              <input
                {...registerPwd("new_password")}
                type="password"
                placeholder="Min. 8 characters"
                className={inputCls}
              />
            </FormField>
            <FormField
              label="Confirm New Password"
              error={pwdErrors.confirm_password?.message}
            >
              <input
                {...registerPwd("confirm_password")}
                type="password"
                placeholder="••••••••"
                className={inputCls}
              />
            </FormField>
            <button
              type="submit"
              disabled={isChangingPwd}
              className="w-full bg-gray-800 dark:bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-500 disabled:opacity-60 transition-all"
            >
              {isChangingPwd ? "Changing…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
