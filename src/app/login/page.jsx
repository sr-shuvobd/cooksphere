"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input } from "@heroui/react";
import {
  FaGoogle,
  FaUtensils,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const loginData = {
      email: form.email.value,
      password: form.password.value,
    };

    console.log(loginData);

    // Better Auth Login Here
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50 dark:from-[#021c17] dark:via-[#03241f] dark:to-[#021c17]">
      <div className="w-full max-w-xl mx-auto space-y-5">
        <div className="rounded-[32px] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#03241f] shadow-2xl p-6 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 dark:border-orange-400 bg-emerald-50 dark:bg-[#042d25]">
              <FaUtensils className="text-2xl text-emerald-600 dark:text-orange-400" />
            </div>

            <h1 className="mt-5 text-3xl md:text-4xl font-black text-stone-800 dark:text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-center text-stone-500 dark:text-stone-400">
              Login to your RecipeHub account
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Email Address
              </label>

              <Input
                className="w-full"
                name="email"
                type="email"
                placeholder="Enter your email address"
                variant="bordered"
                size="lg"
                radius="lg"
                isRequired
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Password
              </label>

              <div className="relative">
                <Input
                  className="w-full"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  isRequired
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-stone-500 hover:text-stone-700 dark:hover:text-white"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-emerald-600 dark:text-orange-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              radius="full"
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold"
            >
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs font-semibold text-stone-500">
              OR
            </span>
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
          </div>

          {/* Google Login */}
          <Button
            variant="bordered"
            size="lg"
            radius="full"
            startContent={<FaGoogle />}
            className="w-full"
          >
            Continue with Google
          </Button>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-stone-500 dark:text-stone-400">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-600 dark:text-orange-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}