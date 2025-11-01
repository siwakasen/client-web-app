import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign, Calendar, Users, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from './_components/carousel-images';
import { Separator } from '@/components/ui/separator';
import { convertTravelImageUrl } from '@/helpers/images-url/travel-images';
import Link from 'next/link';
import { TravelPackages } from '@/interfaces';
import { notFound } from 'next/navigation';
import { useGetCustomer, useGetTravelPackagesDetail } from '@/hooks';
import { useGetRatingsByTravelPackageId } from '@/hooks/rating.hook';
import LiveChat from '@/components/shared/live-chat/live-chat';

export default async function TravelPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Fetch data on the server
  const { id } = await params;
  const { customer } = await useGetCustomer();
  let data: TravelPackages | null = null;
  let ratings: any[] = [];
  try {
    const { data: travel } = await useGetTravelPackagesDetail({
      id: Number(id),
    });
    const ratingsResponse = await useGetRatingsByTravelPackageId(Number(id));
    data = travel;
    if ('data' in ratingsResponse && ratingsResponse.data?.ratings) {
      ratings = ratingsResponse.data.ratings;
    }
  } catch (error) {
    // TOAST ERROR
  }

  if (!data) {
    notFound();
  }

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };
  return (
    <div className="min-h-screen ">
      {/* Hero Section with Title */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={convertTravelImageUrl(data.images?.[0] || '')}
          alt={data.package_name}
          fill
          sizes="100vw"
          quality={100}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
            {data.package_name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-8 md:px-8 lg:px-32 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <ImageCarousel images={data.images || []} alt={data.package_name} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Adventure</Badge>
              <Badge variant="secondary">Relaxation</Badge>
              <Badge variant="secondary">Cultural</Badge>
            </div>

            {/* Description */}
            <div>
              <p className=" leading-relaxed">{data.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Adult Price</p>
                  <p className="font-semibold">
                    {formatPrice(data.package_price)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{data.duration} hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Max Group Size
                  </p>
                  <p className="font-semibold">{data.max_persons} people</p>
                </CardContent>
              </Card>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {data.itineraries.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{"What's Included"}</h2>
              <div className="grid gap-3">
                {data.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Box Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="text-right">
                  <div className="text-lg text-muted-foreground line-through">
                    {formatPrice(Math.floor(data.package_price * 1.3))}
                  </div>
                  <div className="text-5xl font-bold text-primary">
                    {formatPrice(data.package_price)}
                  </div>
                  <Badge variant="destructive" className="mt-1 text-[10px]">
                    30% OFF
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/travel-packages/checkout/${data.id}`}>
                  <Button className="w-full cursor-pointer" size="lg">
                    Book Now
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Price based on per person
                </p>
                <Separator />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          {ratings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ratings.map((rating) => (
                <Card
                  key={rating.id}
                  className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    {/* Star Rating */}
                    <div className="flex items-center mb-4">
                      {renderStars(rating.service_rate)}
                    </div>

                    {/* Blockquote */}
                    <blockquote className="mt-6 border-l-4 border-gray-300 pl-6 italic text-gray-700 leading-relaxed">
                      &quot;{rating.description || 'No description provided.'}
                      &quot;
                    </blockquote>

                    {/* Date */}
                    <div className="mt-4 text-sm text-gray-500">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews available yet.</p>
            </div>
          )}
        </div>
      </div>

      <LiveChat customer={customer} />
    </div>
  );
}
