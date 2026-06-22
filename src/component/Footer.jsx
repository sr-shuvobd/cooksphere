import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaUtensils,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo Section */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-400">
                <FaUtensils className="text-xl text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Recipe<span className="text-orange-400">Hub</span>
                </h2>

                <p className="text-sm text-gray-300">
                  Share. Discover. Cook.
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-300">
              Discover delicious recipes from around the world and share your
              culinary creations with the community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-orange-400">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 transition hover:text-orange-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/browse-recipes"
                  className="text-gray-300 transition hover:text-orange-400"
                >
                  Browse Recipes
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 transition hover:text-orange-400"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-orange-400">
              Contact
            </h3>

            <div className="space-y-3 text-gray-300">
              <p>Dhaka, Bangladesh</p>
              <p>support@recipehub.com</p>
              <p>+880 1234-567890</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-orange-400">
              Follow Us
            </h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 transition hover:border-orange-400 hover:bg-orange-400"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 transition hover:border-orange-400 hover:bg-orange-400"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 transition hover:border-orange-400 hover:bg-orange-400"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-emerald-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} RecipeHub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;