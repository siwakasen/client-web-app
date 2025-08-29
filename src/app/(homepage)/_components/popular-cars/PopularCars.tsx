import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ContentDivider from '../content-divider/ContentDivider';
import { convertCarImageUrl } from '@/helpers/images-url/car-images';
import { SkeletonCard } from '@/components/shared/skeleton/skeleton-card';
import { Car } from '@/interfaces';
import Link from 'next/link';
import { useGetCars } from '@/hooks';
import * as motion from 'motion/react-client';

export default async function PopularCars() {
  let cars: Car[] = [];
  try {
    const { data } = await useGetCars({
      limit: 2,
      page: 1,
      search: '',
    });
    cars = data;
  } catch (error) {
    // TOAST ERROR
  }

  const carsData = cars.map((car) => ({
    id: car.id,
    title: car.car_name,
    image:
      car.car_image &&
      car.car_image.length > 0 &&
      convertCarImageUrl(car.car_image),
    alt: car.car_name,
  }));

  return (
    <motion.section
      className="bg-gray-50 pt-16 px-4 md:px-8 min-h-fit"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ContentDivider
            titleClass={3}
            dividerText="Rent a Car"
            title1="High-quality car rentals"
            title2="that will take you to see the beauty of the world."
            description="Explore the best cars with our exclusive tour packages. Enjoy the beauty of these locations with our professional guides."
          />
        </motion.div>

        {/* Cards Section */}
        {carsData.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 w-full justify-between gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {carsData.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: index * 0.2,
                }}
              >
                <Link href={`/rent-cars`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-0">
                    <CardContent
                      className={`p-0 w-full h-80 md:h-96 md:min-w-2xl`}
                    >
                      <div className="relative h-full w-full">
                        <div className="relative w-full h-full overflow-hidden">
                          {car.image && car.image.length > 0 ? (
                            <Image
                              src={car.image}
                              alt={car.alt}
                              fill
                              priority={true}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <SkeletonCard />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="font-georgia text-2xl md:text-3xl font-bold text-white leading-tight">
                            {car.title}
                          </h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 w-full justify-between gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <SkeletonCard />
            </motion.div>
            <motion.div
              className="w-full hidden md:block"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            >
              <SkeletonCard />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
