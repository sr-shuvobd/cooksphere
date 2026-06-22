"use client";

import { Button } from "@heroui/react";

export default function FeaturedRecipes() {
  return (
    <section className="py-20 bg-white dark:bg-[#021c17]">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black">
            Featured Recipes
          </h2>

          <p className="text-stone-500 mt-3">
            Handpicked recipes selected by our admins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-3xl overflow-hidden bg-white dark:bg-[#03241f] shadow-lg"
            >
              <div className="h-56 bg-stone-200" />

              <div className="p-5">
                <h3 className="font-bold text-xl">
                  Chicken Pasta
                </h3>

                <p className="text-sm text-stone-500 mt-2">
                  Italian • 30 Min
                </p>

                <Button
                  color="warning"
                  className="mt-4 w-full"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}