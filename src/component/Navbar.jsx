"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FaUtensils } from "react-icons/fa";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiSun,
} from "react-icons/fi";

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

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-400 sm:h-12 sm:w-12">
            <FaUtensils className="text-lg text-white sm:text-xl" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Recipe<span className="text-orange-400">Hub</span>
            </h2>

            <p className="hidden text-xs text-gray-300 sm:block">
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
              className={`relative font-medium transition-all duration-300 ${
                pathname === link.href
                  ? "text-orange-400"
                  : "text-white hover:text-orange-300"
              }`}
            >
              {link.name}

              {pathname === link.href && (
                <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-orange-400"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 lg:flex">
          <button className="text-xl text-white">
            <FiSun />
          </button>

          <Button
            as={Link}
            href="/login"
            variant="bordered"
            className="border-white text-white"
          >
            Login
          </Button>

          <Button
            as={Link}
            href="/register"
            className="bg-orange-400 text-white"
          >
            Register
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-white lg:hidden"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-emerald-800 bg-emerald-950 lg:hidden">
          <div className="flex flex-col px-4 py-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-4 py-3 transition ${
                  pathname === link.href
                    ? "bg-orange-400 text-white"
                    : "text-white hover:bg-emerald-800"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-5 flex flex-col gap-3">
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                className="border-white text-white"
              >
                Login
              </Button>

              <Button
                as={Link}
                href="/register"
                className="text-white"
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