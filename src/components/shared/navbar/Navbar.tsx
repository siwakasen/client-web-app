"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLogoutUser } from "@/_hooks";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/_interfaces";

export default function Navbar({
  isAuthenticated,
  customer,
}: {
  isAuthenticated: boolean;
  customer: Customer;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // --- 1. State to track scroll position ---
  const [isScrolled, setIsScrolled] = useState(false);
  // --- Auth state ---

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

  const handleLogout = async () => {
    const { message } = await useLogoutUser();
    setIsOpen(false); // Close mobile menu after logout
  };

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
          ? "bg-gray-50 shadow-md"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-bold">
            <span className="text-green-400">Ride Bali</span>{" "}
            {/* Conditionally change logo text color */}
            <span className={isScrolled ? "text-gray-900" : "text-white"}>
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
                    ? "text-gray-900 hover:text-green-600"
                    : "text-white hover:text-green-400"
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
                  isScrolled
                    ? "text-gray-900 hover:text-green-600"
                    : "text-white hover:text-green-400"
                }`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 bg-white backdrop-blur-md border-r"
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
              {/* Auth Section */}
              <div className="pb-4 border-b border-gray-200 px-2">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {customer.email}
                        </p>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 py-3 px-4"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Login Button */}
                    <Button
                      asChild
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>

                    {/* Register Button */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50 py-3"
                    >
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-4 mt-8">
                {/* Navigation Items */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-800 hover:text-green-600 transition-colors duration-200 py-3 px-4  hover:bg-green-50 border-b border-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Auth Buttons/Profile Icon */}
        <div className="ml-4 hidden md:flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div
                  className={`rounded-md transition-colors duration-200 hover:bg-white/10 cursor-pointer ${
                    isScrolled ? "hover:bg-gray-200" : ""
                  }`}
                  aria-label="Profile"
                >
                  <div
                    className={`flex items-center bg-gray-50 rounded-md px-3 py-2 ${
                      isScrolled ? "text-gray-900" : "text-black"
                    }`}
                  >
                    <User className="h-5 w-5  font-bold" />
                    <ChevronDown className="h-4 w-4 ml-1  font-bold" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-xs text-gray-800">{customer.name}</p>
                    <p className="text-xs text-gray-600">{customer.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-2">
                {/* Conditionally change button styles */}
                <Button
                  asChild
                  size="lg"
                  className={`transition-all duration-300 rounded-full ${
                    isScrolled
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-black/30"
                  }`}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className={`transition-all duration-300 rounded-full ${
                    isScrolled
                      ? "bg-slate-500 text-white hover:bg-slate-600"
                      : "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-black/30"
                  }`}
                >
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
