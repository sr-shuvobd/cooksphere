"use client";

import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
} from "react-icons/fa";

export default function TopCategories() {
  const categories = [
    "Pizza",
    "Burger",
    "Dessert",
    "Asian",
    "Healthy",
    "BBQ",
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#021c17]">
      <div className="container max-w-7xl mx-auto px-4">

        <h2 className="text-center text-4xl font-black mb-14">
          Top Categories
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((item) => (
            <div
              key={item}
              className="rounded-3xl p-8 text-center bg-stone-100 dark:bg-[#03241f]"
            >
              <FaPizzaSlice className="mx-auto text-4xl text-orange-500" />
              <h3 className="mt-4 font-bold">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}