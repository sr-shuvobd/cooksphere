"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FaUtensils } from "react-icons/fa";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Browse Recipes",
    href: "/browse-recipes",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#021c17]/85 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/40 shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-500 dark:border-orange-400 sm:h-12 sm:w-12 transition-colors duration-300 bg-emerald-50 dark:bg-[#042d25]">
            <FaUtensils className="text-lg text-emerald-600 dark:text-orange-400 sm:text-xl transition-colors duration-300" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-stone-800 dark:text-white sm:text-2xl tracking-tight transition-colors duration-300">
              Recipe<span className="text-emerald-600 dark:text-orange-400 transition-colors duration-300">Hub</span>
            </h2>

            <p className="hidden text-xs text-stone-500 dark:text-stone-400 sm:block font-medium">
              Share. Discover. Cook.
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 font-semibold text-sm transition-all duration-300 ${
                pathname === link.href
                  ? "text-emerald-600 dark:text-orange-400"
                  : "text-stone-600 dark:text-stone-300 hover:text-emerald-500 dark:hover:text-orange-300"
              }`}
            >
              {link.name}

              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-emerald-600 dark:bg-orange-400"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 lg:flex">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-emerald-600 dark:hover:text-orange-400 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? <FiSun className="text-orange-400" /> : <FiMoon className="text-emerald-600" />}
          </button>

          <Button
            as={Link}
            href="/login"
            variant="bordered"
            className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 font-semibold text-sm"
          >
            Login
          </Button>

          <Button
            as={Link}
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold text-sm shadow-sm transition-colors duration-300"
          >
            Register
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-emerald-600 dark:hover:text-orange-400 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? <FiSun className="text-orange-400" /> : <FiMoon className="text-emerald-600" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-2xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors duration-300"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-stone-200/60 dark:border-stone-850 bg-white/95 dark:bg-[#021c17]/95 backdrop-blur-md lg:hidden transition-all duration-300">
          <div className="flex flex-col px-4 py-5 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-emerald-50 text-emerald-700 dark:bg-orange-500/10 dark:text-orange-400"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/60 flex flex-col gap-3">
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                onClick={() => setIsOpen(false)}
                className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 font-semibold"
              >
                Login
              </Button>

              <Button
                as={Link}
                href="/register"
                onClick={() => setIsOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold shadow-sm"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;