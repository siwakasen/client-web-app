import Image from 'next/image';

export default function WelcomeSection() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      {/* Logo */}
      <div className="w-80 h-32 relative shadow-xl rounded-lg px-2 py-4 bg-gray-100">
        <span className="text-green-600 font-bold text-5xl">Bali Travel</span>{' '}
        <span className="text-gray-800 font-bold text-5xl">Ride</span>
      </div>

      {/* Welcome Text */}
      <div className="space-y-4 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Bali Travel Ride
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Explore Bali with us and enjoy the best experience with our best
          travel packages and car rental services.
        </p>
      </div>
    </div>
  );
}
