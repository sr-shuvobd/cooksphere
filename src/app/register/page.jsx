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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const newErrors = {};

    if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain one lowercase letter";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) return;

    const userData = {
      name: form.name.value,
      email: form.email.value,
      image: form.image.value,
      password,
    };

    console.log(userData);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50 dark:from-[#021c17] dark:via-[#03241f] dark:to-[#021c17]">
      <div className="w-full max-w-xl mx-auto">
        <div className="rounded-[32px] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#03241f] shadow-2xl p-6 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 dark:border-orange-400 bg-emerald-50 dark:bg-[#042d25]">
              <FaUtensils className="text-2xl text-emerald-600 dark:text-orange-400" />
            </div>

            <h1 className="mt-5 text-3xl md:text-4xl font-black text-stone-800 dark:text-white">
              Create Account
            </h1>

            <p className="mt-2 text-center text-stone-500 dark:text-stone-400">
              Join RecipeHub and start sharing amazing recipes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Full Name
              </label>

              <Input
                className="w-full"
                name="name"
                placeholder="Enter your full name"
                variant="bordered"
                size="lg"
                radius="lg"
                isRequired
              />
            </div>

            {/* Email */}
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

            {/* Image */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Profile Image URL
              </label>

              <Input
                className="w-full"
                name="image"
                placeholder="https://example.com/profile.jpg"
                variant="bordered"
                size="lg"
                radius="lg"
                isRequired
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Password
              </label>

              <div className="relative">
                <Input
                  className="w-full"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  isRequired
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Confirm Password
              </label>

              <div className="relative">
                <Input
                  className="w-full"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  isRequired
                  isInvalid={
                    !!errors.confirmPassword
                  }
                  errorMessage={
                    errors.confirmPassword
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-stone-500 hover:text-stone-700 dark:hover:text-white"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              radius="full"
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold"
            >
              Create Account
            </Button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs font-semibold text-stone-500">
              OR
            </span>
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
          </div>

          <Button
            variant="bordered"
            size="lg"
            radius="full"
            startContent={<FaGoogle />}
            className="w-full"
          >
            Continue with Google
          </Button>

          <p className="mt-7 text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 dark:text-orange-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}