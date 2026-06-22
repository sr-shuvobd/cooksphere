"use client";

import { FaHeart } from "react-icons/fa";

export default function PopularRecipes() {
  return (
    <section className="py-20 bg-stone-100 dark:bg-[#011411]">
      <div className="container max-w-7xl mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-black">
            Popular Recipes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((item)=>(
            <div
              key={item}
              className="rounded-3xl bg-white dark:bg-[#03241f] p-6"
            >
              <h3 className="font-bold">
                Beef Burger
              </h3>

              <div className="flex items-center gap-2 mt-3">
                <FaHeart className="text-red-500" />
                <span>2.5K Likes</span>
              </div>

              <p className="text-sm mt-2 text-stone-500">
                By Shohan
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}