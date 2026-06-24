"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { FaGoogle, FaUtensils, FaEye, FaEyeSlash } from "react-icons/fa";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState("");

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB");
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setImageError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=4983d5f47f26efc3e85064efe6b1a73c",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (result.success && result.data && result.data.url) {
        setImageUrl(result.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        const errMsg =
          result.error?.message || "Upload failed. Please try again.";
        setImageError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      setImageError("Connection error. Please try again.");
      toast.error("Connection error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const newErrors = {};
    setFormError("");

    if (!name) {
      newErrors.name = "Full name is required";
      toast.error("Full name is required");
    }

    if (!email) {
      newErrors.email = "Email address is required";
      toast.error("Email address is required");
    }

    if (!password) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      toast.error("Password must be at least 6 characters");
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      toast.error("Password must contain at least one uppercase letter");
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
      toast.error("Password must contain at least one lowercase letter");
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
    }

    if (!imageUrl) {
      setImageError("Please upload a profile image");
      toast.error("Please upload a profile image");
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      const firstError = Object.values(newErrors)[0];
      setFormError(firstError);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
      });

      if (error) {
        setFormError(error.message || "Failed to create account.");
        toast.error(error.message || "Failed to create account.");
      } else {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      console.error("Signup exception caught:", err);
      setFormError(
        err.message || "An unexpected error occurred during signup.",
      );
      toast.error(err.message || "An unexpected error occurred during signup.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to authenticate with Google.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50 dark:from-[#021c17] dark:via-[#03241f] dark:to-[#021c17]">
      <div className="w-full max-w-xl mx-auto">
        <div className="rounded-[32px] border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#03241f] shadow-2xl p-6 md:p-10">
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

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-450 text-sm font-semibold text-center">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                Profile Image
              </label>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-white/5">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-850 flex items-center justify-center flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🍳</span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-white border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-bold cursor-pointer hover:bg-stone-50 dark:hover:bg-white/10 transition-all"
                  >
                    {isUploading
                      ? "Uploading..."
                      : imageUrl
                        ? "Change Image"
                        : "Choose File"}
                  </label>
                  {imageError && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">
                      {imageError}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 dark:text-stone-400 mt-1.5 leading-relaxed">
                    PNG, JPG or WEBP up to 5MB (Uploaded directly to ImgBB)
                  </p>
                </div>
              </div>
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
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
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

            <div>
              <label className="block mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Confirm Password
              </label>

              <div className="relative">
                <Input
                  className="w-full"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  isRequired
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-stone-500 hover:text-stone-700 dark:hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              radius="full"
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold"
              disabled={isUploading}
            >
              {isUploading ? "Uploading Image..." : "Create Account"}
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
            onPress={handleGoogleSignIn}
          >
            Continue with Google
          </Button>

          <p className="mt-7 text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 dark:text-orange-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
