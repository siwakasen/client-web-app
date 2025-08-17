import Image from 'next/image';
export default async function Hero() {
  return (
    <div className="w-screen h-screen relative">
      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full  z-10"></div>
      {/* Background image */}
      <Image
        src="/images/hero4_img.jpg"
        alt="hero"
        fill
        priority
        className="object-cover absolute top-0 left-0"
      />
      {/* Hero content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        {/* Main title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 md:mb-8 relative">
          <span className="relative inline-block">
            <span
              className="absolute left-0  w-full h-full text-black opacity-50 blur-sm select-none pointer-events-none"
              aria-hidden="true"
            >
              Ride Bali Explore
            </span>
            <span className="relative">Ride Bali Explore</span>
          </span>
        </h1>
      </div>
    </div>
  );
}
