"use client";

import { Button } from "@heroui/react";

export default function PremiumCTA() {
  return (
    <section className="py-20">
      <div className="container max-w-5xl mx-auto px-4">

        <div className="rounded-[40px] bg-gradient-to-r from-emerald-600 to-teal-500 p-12 text-center text-white">

          <h2 className="text-5xl font-black">
            Upgrade To Premium
          </h2>

          <p className="mt-4">
            Unlock unlimited recipe uploads and
            premium features.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-white text-black"
          >
            Upgrade Now
          </Button>

        </div>
      </div>
    </section>
  );
}