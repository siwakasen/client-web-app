import React from "react";
import { Star } from "lucide-react";

export default function Manager() {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Meet Our Manager
          </h2>

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            {/* Profile Image with Star Badge */}
            <div className="relative mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src="images/profile2.jpg"
                  alt="Manager"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Star Badge */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
            </div>

            {/* Name and Title */}
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Ms. Hanna</h3>
            <p className="text-lg text-gray-600 mb-8">Manager</p>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              With over 15 years of industry experience, Hanna leads our company
              with vision and innovation. His commitment to excellence and
              sustainable practices has transformed how we approach business in
              the modern era.
            </p>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-12"></div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 text-center">
          {/* Years Experience */}
          <div className="py-8 border-b md:border-b-0 border-gray-300">
            <div className="text-5xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600 text-lg">Years Experience</div>
          </div>

          {/* Projects Completed */}
          <div className="py-8 border-b md:border-b-0 md:border-l md:border-r border-gray-300">
            <div className="text-5xl font-bold text-gray-900 mb-2">200+</div>
            <div className="text-gray-600 text-lg">Projects Completed</div>
          </div>

          {/* Global Partners */}
          <div className="py-8">
            <div className="text-5xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600 text-lg">Global Partners</div>
          </div>
        </div>
      </div>
    </div>
  );
}
