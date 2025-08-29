import MainContent from './_components/main-content';
import Image from 'next/image';
import Navbar from '@/components/shared/navbar/Navbar';
import Footer from '@/components/shared/content/footer';
import * as motion from 'motion/react-client';

import { useGetCustomer } from '@/hooks';
export default async function RentCarsPage({
  searchParams,
}: {
  searchParams: Promise<{
    start_date?: string;
    end_date?: string;
    search?: string;
  }>;
}) {
  const { isAuthenticated, customer } = await useGetCustomer();
  const { start_date, end_date, search } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar isAuthenticated={isAuthenticated} customer={customer!} />
      {/* Hero Section */}
      <motion.section
        className="relative h-64 md:h-80 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {/* Background Image */}
        <Image
          src="/images/bali_1.jpg"
          priority
          alt="Bali landscape"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />

        {/* Content Container */}
        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
          >
            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.9 }}
            >
              Car Rental
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl opacity-90"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
            >
              Explore the best cars in Bali
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>

      <MainContent
        initialStartDate={start_date}
        initialEndDate={end_date}
        initialSearch={search}
      />
      <Footer />
    </div>
  );
}
