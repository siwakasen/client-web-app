import MainContent from './_components/main-content';
import Image from 'next/image';
import Navbar from '@/components/shared/navbar/Navbar';
import Footer from '@/components/shared/content/footer';
import * as motion from 'motion/react-client';

import { Meta, TravelPackages } from '@/interfaces';
import { useGetTravelPackages } from '@/hooks';
import { useGetCustomer } from '@/hooks/customer.hook';

export default async function TourPackagesPage() {
  const { isAuthenticated, customer } = await useGetCustomer();
  let travelPackages: TravelPackages[] = [];
  let metaPackages: Meta = {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  };
  try {
    const { data, meta: metaData } = await useGetTravelPackages({
      limit: 6,
      page: 1,
      search: '',
    });
    travelPackages = data;
    metaPackages = metaData;
  } catch (error) {}
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
              Travel Packages
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl opacity-90"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
            >
              Explore the best tour packages in Bali
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>

      <MainContent tourPackages={travelPackages} meta={metaPackages} />
      <Footer />
    </div>
  );
}
