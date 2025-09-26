import Image from 'next/image';
import Footer from '@/components/shared/content/footer';
import { BookingList } from './_components/booking-list';
import LiveChat from '@/components/shared/live-chat/live-chat';
import { useGetCustomer } from '@/hooks/customer.hook';

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}) {
  const { page, status } = await searchParams;
  const { customer } = await useGetCustomer();
  const currentPage = Number(page) || 1;
  const limit = 10; // Changed from 20 to 10 as requested

  // Ensure default status is "All" (empty string) when no status is provided
  const currentStatus = status || '';

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <Image
          src="/images/bali_1.jpg"
          priority
          quality={70}
          alt="Bali landscape"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover "
        />
        <div className="absolute inset-0 " />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              History Order
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              View and manage your bookings and rental history
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 min-h-dvh">
        <BookingList
          currentPage={currentPage}
          limit={limit}
          status={currentStatus}
        />
      </div>
      <LiveChat customer={customer} />
      <Footer />
    </>
  );
}
