import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero3_img.jpg')`,
        }}
      />
      {/* Gradient Overlay - White to Transparent */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/60 to-transparent" />
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Small Label */}
        <p className="text-gray-600 text-lg mb-4 font-medium">
          Begin your journey
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
          Let's Just Get Travel
          <br />
          Around The World
        </h1>

        {/* Description */}
        <p className="text-gray-700 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Ready to turn your dreams into reality? Get in touch with us today and
          let's start planning your next adventure!
        </p>

        {/* CTA Button */}
        <Button
          variant="default"
          className="bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl py-6 px-16"
        >
          <Link href="/travel-packages">Join the Trip</Link>
        </Button>
      </div>
    </div>
  );
}
