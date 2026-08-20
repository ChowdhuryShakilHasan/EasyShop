"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  Zap,
  PieChart,
  Home,
  Users,
  Settings,
} from "lucide-react";
import { loginSchema, LoginFormValues } from "../../lib/validators/authSchema";
import { useLoginMutation } from "../../redux/slices/apiSlice";
import { setCredentials } from "../../redux/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      const user = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials(user));
      router.push("/dashboard");
    } catch {
      setServerError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — illustrated, desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 flex-col justify-between px-12 py-10">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <ShoppingBag size={18} className="text-orange-500" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Easy<span className="text-orange-400">Shop</span>
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            Manage your store,
            <br />
            <span className="text-orange-400">effortlessly</span>
          </h1>
          <p className="text-blue-100 text-sm max-w-xs mb-8">
            Track orders, manage products, and grow your business all in one
            place.
          </p>

          <div className="relative max-w-md">
            <div className="absolute -top-6 right-6 w-11 h-11 rounded-2xl bg-blue-500 shadow-xl flex items-center justify-center z-20 rotate-6">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-5 -left-6 w-11 h-11 rounded-2xl bg-orange-500 shadow-xl flex items-center justify-center z-20 -rotate-6">
              <BarChart3 size={20} className="text-white" />
            </div>

            <div className="bg-blue-950/60 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>

              <div className="p-4 flex gap-3">
                <div className="flex flex-col gap-2 bg-white/5 rounded-xl p-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/80 flex items-center justify-center">
                    <Home size={12} className="text-white" />
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={12} className="text-blue-200" />
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <Users size={12} className="text-blue-200" />
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <Settings size={12} className="text-blue-200" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-blue-200 mb-1">
                      Total Sales
                    </p>
                    <p className="text-lg font-bold text-white">$24,580</p>
                    <svg viewBox="0 0 100 24" className="w-full h-6 mt-1">
                      <polyline
                        points="0,20 15,15 30,18 45,8 60,12 75,4 100,6"
                        fill="none"
                        stroke="#60A5FA"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-blue-200 mb-1">Orders</p>
                      <p className="text-sm font-bold text-white">1,248</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-blue-200 mb-1">
                          Products
                        </p>
                        <p className="text-sm font-bold text-white">320</p>
                      </div>
                      <PieChart size={20} className="text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-6 text-xs text-blue-100">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-blue-300" /> Secure &amp; Safe
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-blue-300" /> Fast &amp; Reliable
          </span>
          <span className="flex items-center gap-1.5">
            <PieChart size={14} className="text-blue-300" /> Insights &amp; Analytics
          </span>
        </div>
      </div>

      {/* Right panel — form (blue gradient on mobile, white on desktop) */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 lg:bg-none lg:bg-white px-4 py-10 relative overflow-hidden">
        <div className="lg:hidden absolute w-72 h-72 bg-orange-500/20 rounded-full blur-3xl -top-20 -right-20" />
        <div className="lg:hidden absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -bottom-20 -left-20" />

        <div className="w-full max-w-sm relative z-10">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <ShoppingBag size={18} className="text-orange-500" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Easy<span className="text-orange-400">Shop</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-0 lg:shadow-none lg:rounded-none">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <ShoppingBag size={26} className="text-orange-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight text-center">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Sign in to your admin dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                    placeholder="admin@easyshop.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  Remember me
                </label>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-orange-700 disabled:opacity-60 transition-colors shadow-lg shadow-blue-600/25"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>


          </div>

        </div>
      </div>
    </div>
  );
}