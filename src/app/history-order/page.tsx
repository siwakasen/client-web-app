import Image from 'next/image';
import Footer from '@/components/shared/content/footer';
import { BookingList } from './_components/booking-list';

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 20;

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <Image
          src="/images/bali_1.jpg"
          priority
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

      <div className="container mx-auto px-4 py-8">
        <BookingList currentPage={currentPage} limit={limit} />
      </div>
      <Footer />
    </>
  );
}
