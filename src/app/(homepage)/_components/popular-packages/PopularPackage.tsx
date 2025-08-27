import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ContentDivider from '../content-divider/ContentDivider';
import { convertTravelImageUrl } from '@/helpers/images-url/travel-images';
import Link from 'next/link';
import { TravelPackages } from '@/interfaces';
import { SkeletonCard } from '@/components/shared/skeleton/skeleton-card';
import { useGetTravelPackages } from '@/hooks';

export default async function PopularPackage() {
  let packages: TravelPackages[] = [];
  try {
    const { data } = await useGetTravelPackages({
      limit: 2,
      page: 1,
      search: '',
    });
    packages = data;
  } catch (error) {}

  const packagesData = packages.map((pkg) => ({
    id: pkg.id,
    title: pkg.package_name,
    image:
      pkg.images &&
      pkg.images.length > 0 &&
      convertTravelImageUrl(pkg.images[0]),
    alt: pkg.package_name,
  }));

  return (
    <section
      className={`bg-gray-50 pt-16 px-4 md:px-8 ${
        packagesData.length > 0 ? 'min-h-screen' : 'min-h-fit'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ContentDivider
          dividerText="Popular Destinations"
          title1="Exclusive"
          title2="Destination"
          titleClass={6}
          description="Explore the best destinations with our exclusive tour packages. Enjoy the beauty of these locations with our professional guides."
        />

        {/* Cards Section */}
        {packagesData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 w-full justify-between gap-8">
            {packagesData.map((pkg, index) => (
              <Link href={`/travel-packages/${pkg.id}`} key={pkg.id}>
                <Card
                  key={pkg.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-0"
                >
                  <CardContent
                    className={`p-0 w-full h-80 md:h-96 ${
                      index === 0 ? 'md:min-w-96' : 'md:min-w-2xl'
                    }`}
                  >
                    <div className="relative h-full w-full">
                      <div className="relative w-full h-full overflow-hidden">
                        {pkg.image && pkg.image.length > 0 ? (
                          <Image
                            src={pkg.image}
                            alt={pkg.alt}
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
                          {pkg.title}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 w-full justify-between gap-8">
            <div className="w-full">
              <SkeletonCard />
            </div>
            <div className="w-full hidden md:block">
              <SkeletonCard />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
