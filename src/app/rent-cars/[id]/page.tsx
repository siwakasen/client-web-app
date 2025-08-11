import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Users, Check, Key, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { convertCarImageUrl } from "@/helpers/images-url/car-images";
import Link from "next/link";
import React from "react";
import { Car } from "@/interfaces";
import { notFound, redirect } from "next/navigation";
import { useGetCarsDetail } from "@/hooks";

export default async function CarDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ start_date?: string; end_date?: string }>;
}) {

  const { start_date, end_date } = await searchParams;
  if (!start_date || !end_date) {
    redirect("/rent-cars");
  }
  const { id } = await params;
  let data: Car | null = null;
  try {
    const { data: car } = await useGetCarsDetail(Number(id));
    data = car;
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
          src={convertCarImageUrl(data.car_image || "")}
          alt={data.car_name}
          fill
          sizes="100vw"
          quality={100}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
            {data.car_name}
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-2 sm:px-8 md:px-8 lg:px-32 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            {data.car_image ? (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden hidden lg:block">
                <Image
                  src={convertCarImageUrl(data.car_image)}
                  alt={`${data.car_name} - Image`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-200 hidden lg:block">
                <div className="flex items-center justify-center h-full text-gray-500">
                  No image available
                </div>
              </div>
            )}
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
                  <p className="text-sm text-muted-foreground">Price/Day</p>
                  <p className="font-semibold">
                    {formatPrice(data.price_per_day)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Max Persons</p>
                  <p className="font-semibold">{data.max_persons} people</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Palette className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-semibold">{data.car_color}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Key className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-semibold">{data.transmission}</p>
                </CardContent>
              </Card>
            </div>
            {/* What's Included */}
            <div>
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
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
                    {formatPrice(Math.floor(data.price_per_day * 1.3))}
                  </div>
                  <div className="text-5xl font-bold text-primary">
                    {formatPrice(data.price_per_day)}
                  </div>
                  <Badge variant="destructive" className="mt-1 text-[10px]">
                    30% OFF
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/rent-cars/checkout/${data.id}?start_date=${start_date}&end_date=${end_date} `}>
                  <Button className="w-full cursor-pointer" size="lg">
                    Rent Now
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Price per day
                </p>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span>{data.car_color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission:</span>
                    <span>{data.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Persons:</span>
                    <span>{data.max_persons} people</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
