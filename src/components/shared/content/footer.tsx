import { MapPin } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Bali Travel Ride</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Discover the world with us. Explore destinations, create memories,
              and make every trip unforgettable.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-gray-300">
            © 2025 Travel Bali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
