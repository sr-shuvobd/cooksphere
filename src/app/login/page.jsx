"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { FaGoogle, FaUtensils, FaEye, FaEyeSlash } from "react-icons/fa";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#021c17]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 dark:border-orange-400 border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    setIsLoading(true);
    setFormError("");

    if (!email || !password) {
      toast.error("Email and password are required");
      setFormError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setFormError(error.message || "Invalid email or password.");
        toast.error(error.message || "Invalid email or password.");
      } else {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setFormError("An unexpected error occurred during login.");
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      toast.error("Failed to authenticate with Google.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50 dark:from-[#021c17] dark:via-[#03241f] dark:to-[#021c17]">
      <div className="w-full max-w-xl mx-auto space-y-5">
        <div className="rounded-[32px] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#03241f] shadow-2xl p-6 md:p-10">
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

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-450 text-sm font-semibold text-center">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  isRequired
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-stone-500 hover:text-stone-700 dark:hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs font-semibold text-stone-500">OR</span>
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
          </div>

          <Button
            variant="bordered"
            size="lg"
            radius="full"
            startContent={<FaGoogle />}
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>

          <p className="mt-7 text-center text-sm text-stone-500 dark:text-stone-400">
            Don't have an account?{" "}
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