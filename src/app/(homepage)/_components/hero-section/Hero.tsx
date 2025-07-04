import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-screen h-screen relative">
      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-10"></div>
      xxxx
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
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 md:mb-8 ">
          Ride Bali Explore
        </h1>
      </div>
    </div>
  );
}
