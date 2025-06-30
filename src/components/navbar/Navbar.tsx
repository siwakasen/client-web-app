"use client"
import Link from "next/link";
import { useState, useEffect } from "react"; // Import useEffect

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // --- 1. State to track scroll position ---
  const [isScrolled, setIsScrolled] = useState(false);


  // --- 2. Effect to handle scroll event ---
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user scrolls down more than 10px
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/travel-packages", label: "Packages Tour" },
    { href: "/rent-cars", label: "Cars Rental" },
  ];

  return (
    // --- 3. Conditionally change navbar styles ---
    <nav
      className={`w-full fixed top-0 left-0 z-50 px-4 md:px-8 py-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-50 shadow-md'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-bold">
            <span className="text-green-400">Ride Bali</span>{" "}
            {/* Conditionally change logo text color */}
            <span className={isScrolled ? 'text-gray-900' : 'text-white'}>
              Explore
            </span>
          </span>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                // Conditionally change link text color and hover color
                className={`font-bold transition-colors duration-200 lg:mx-6 xl:mx-8 ${
                  isScrolled
                    ? 'text-gray-900 hover:text-green-600'
                    : 'text-white hover:text-green-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                // Conditionally change menu icon color
                className={`hover:bg-white/10 ${
                    isScrolled ? 'text-gray-900 hover:text-green-600' : 'text-white hover:text-green-400'
                }`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 bg-white/80 backdrop-blur-md border-r"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="text-2xl font-bold">
                  <span className="text-green-600">Ride Bali</span>{" "}
                  <span className="text-gray-800 ">Explore</span>
                </SheetTitle>
                <SheetDescription className="text-gray-600 ">
                  Navigate through our services
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-800 hover:text-green-600 transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-green-50 border-b border-gray-100 last:border-b-0"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop "Book Now" Button */}
        <div className="hidden md:block">
          
            {/* Conditionally change button styles */}
            <Button asChild size="lg" className={`transition-all duration-300 rounded-full ${isScrolled ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-black/30'}`}>
                <Link href="/travel-packages">
                  Book Now
                </Link>
              </Button>
        </div>
      </div>
    </nav>
  );
}