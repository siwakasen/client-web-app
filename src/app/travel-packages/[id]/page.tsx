import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Calendar, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "./_components/carousel-images";
import { Separator } from "@/components/ui/separator";
import { convertTravelImageUrl } from "@/_helpers/images-url/travel-images";
import Link from "next/link";
import { TravelPackages } from "@/_interfaces/travel-packages.interface";
import { notFound } from "next/navigation";
import {
  useGetTravelPackages,
  useGetTravelPackagesDetail,
} from "@/_hooks/travel-packages/travel.hook";
import { getHeaders } from "@/lib";

export default async function TravelPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const headers = await getHeaders();
  // Fetch data on the server
  const { id } = await params;
  let data: TravelPackages | null = null;
  let filteredRelatedPackages: TravelPackages[] = [];
  try {
    const { data: travel } = await useGetTravelPackagesDetail(
      {
        id: Number(id),
      },
      headers
    );
    const relatedPackages = await useGetTravelPackages(
      {
        limit: 6,
        page: 1,
        search: "",
      },
      headers
    );
    data = travel;
    filteredRelatedPackages = relatedPackages.data
      .filter((pkg) => pkg.id !== Number(id))
      .slice(0, 4);
  } catch (error) {
    // TOAST ERROR
  }

  if (!data) {
    notFound();
  }

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  return (
    <div className="min-h-screen ">
      {/* Hero Section with Title */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={convertTravelImageUrl(data.images?.[0] || "")}
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
              <p className="text-muted-foreground leading-relaxed">
                {data.description}
              </p>
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
                      <p className="text-muted-foreground">{item}</p>
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

        {/* Related Packages */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            Explore More Package Tours
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRelatedPackages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/travel-packages/${pkg.id}`}
                className="block h-full"
              >
                <Card className="flex flex-col h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-white p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={convertTravelImageUrl(pkg.images?.[0] || "")}
                      alt={pkg.package_name}
                      fill
                      className="object-cover w-full h-full rounded-t-2xl"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">
                      {pkg.package_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-primary font-bold">
                        ${pkg.package_price.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-slate-700 hover:bg-slate-900 text-white cursor-pointer"
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
