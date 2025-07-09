"use cache";
import ContentDivider from "../content-divider/ContentDivider";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default async function WhyChooseUs() {
  const features = [
    {
      number: "1",
      title: "Enjoy a great journey tailored just for you",
      description: "We provide the best experiences for our customers.",
    },
    {
      number: "2",
      title: "Affordable and reliable services",
      description: "Experience the best quality at a reasonable price.",
    },
    {
      number: "3",
      title: "Trusted by thousands",
      description: "Join the community of happy travelers.",
    },
    {
      number: "4",
      title: "Wide range of options",
      description: "From budget-friendly to luxurious travels.",
    },
  ];

  return (
    <section className="bg-gray-50 md:pt-16 pt-8 px-4 md:px-8 min-h-screen ">
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <ContentDivider
            dividerText="Why Choose Us"
            title1="Your Trusted"
            title2="Partner In Travel"
            description="We are a team of travel experts who are passionate about helping you explore the world."
            titleClass={6}
          />
        </div>

        <div className="flex flex-col  md:flex-row w-full justify-between md:gap-12 gap-8 items-center">
          {/* Image Card */}
          <Card className="p-0 group overflow-hidden border-0  transition-all duration-300 cursor-pointer lg:w-1/2 mx-4 md:mx-0">
            <CardContent className="p-0 w-full min-w-96 h-80 md:h-96 lg:h-[500px] bg-transparent">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/images/hero3_img.jpg"
                  alt="Why Choose Us"
                  fill
                  priority={true}
                  sizes="(max-width: 768px)"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 w-fit"
                />
              </div>
            </CardContent>
          </Card>

          {/* Features List */}
          <div className="lg:w-1/2 space-y-8 px-12 md:px-0">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {feature.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
