import Image from 'next/image';
import * as motion from 'motion/react-client';
export default async function Hero() {
  return (
    <motion.div
      className="w-screen h-screen relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10"></div>
      {/* Background image */}
      <Image
        src="/images/hero4_img.jpg"
        alt="hero"
        fill
        priority
        className="object-cover absolute top-0 left-0"
      />
      {/* Hero content */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      >
        {/* Main title */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 md:mb-8 relative"
          initial={{ opacity: 0, y: -80, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
        >
          <motion.span
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
          >
            <motion.span
              className="absolute left-0 w-full h-full text-black opacity-50 blur-sm select-none pointer-events-none"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 0.5, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
            >
              Bali Travel Ride
            </motion.span>
            <motion.span
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.5 }}
            >
              Bali Travel Ride
            </motion.span>
          </motion.span>
        </motion.h1>
      </motion.div>
    </motion.div>
  );
}
