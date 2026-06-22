"use client";

import {
  FaHeart,
  FaGlobe,
  FaCrown,
  FaBookOpen,
} from "react-icons/fa";

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-stone-100 dark:bg-[#011411]">
      <div className="container max-w-7xl mx-auto px-4">

        <h2 className="text-center text-4xl font-black mb-14">
          Why Choose RecipeHub?
        </h2>

        <div className="grid lg:grid-cols-4 gap-6">

          <Feature title="Save Favorites" />
          <Feature title="Premium Access" />
          <Feature title="Global Recipes" />
          <Feature title="Recipe Sharing" />

        </div>
      </div>
    </section>
  );
}

function Feature({ title }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#03241f] p-8">
      <FaCrown className="text-3xl text-orange-500" />

      <h3 className="mt-4 font-bold text-xl">
        {title}
      </h3>
    </div>
  );
}