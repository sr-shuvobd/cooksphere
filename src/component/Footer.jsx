import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaUtensils,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-stone-100 dark:bg-[#011411] text-stone-800 dark:text-stone-300 border-t border-stone-200/60 dark:border-stone-900/60 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-500 dark:border-orange-400 bg-emerald-50 dark:bg-[#03241f] transition-colors duration-300">
                <FaUtensils className="text-lg text-emerald-600 dark:text-orange-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  Recipe<span className="text-emerald-600 dark:text-orange-400">Hub</span>
                </h2>

                <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                  Share. Discover. Cook.
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400 font-medium">
              Discover delicious recipes from around the world and share your culinary creations with a passionate community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-bold text-emerald-700 dark:text-orange-400 tracking-wide uppercase">
              Quick Links
            </h3>

            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <Link
                  href="/"
                  className="text-stone-600 dark:text-stone-400 transition-colors duration-200 hover:text-emerald-600 dark:hover:text-orange-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/browse-recipes"
                  className="text-stone-600 dark:text-stone-400 transition-colors duration-200 hover:text-emerald-600 dark:hover:text-orange-400"
                >
                  Browse Recipes
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-stone-600 dark:text-stone-400 transition-colors duration-200 hover:text-emerald-600 dark:hover:text-orange-400"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-bold text-emerald-700 dark:text-orange-400 tracking-wide uppercase">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-stone-600 dark:text-stone-400 font-semibold">
              <p>Dhaka, Bangladesh</p>
              <p>support@recipehub.com</p>
              <p>+880 1234-567890</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-base font-bold text-emerald-700 dark:text-orange-400 tracking-wide uppercase">
              Follow Us
            </h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-300 transition-all duration-300 hover:border-emerald-650 hover:bg-emerald-600 hover:text-white dark:hover:border-orange-500 dark:hover:bg-orange-500"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-300 transition-all duration-300 hover:border-emerald-650 hover:bg-emerald-600 hover:text-white dark:hover:border-orange-500 dark:hover:bg-orange-500"
                aria-label="Github"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-300 transition-all duration-300 hover:border-emerald-650 hover:bg-emerald-600 hover:text-white dark:hover:border-orange-500 dark:hover:bg-orange-500"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-stone-200 dark:border-stone-900 pt-6 text-center">
          <p className="text-xs text-stone-500 dark:text-stone-550 font-semibold">
            © {new Date().getFullYear()} RecipeHub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;