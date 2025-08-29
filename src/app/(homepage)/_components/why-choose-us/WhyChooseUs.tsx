import ContentDivider from '../content-divider/ContentDivider';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import * as motion from 'motion/react-client';

export default async function WhyChooseUs() {
  const features = [
    {
      number: '1',
      title: 'Enjoy a great journey tailored just for you',
      description: 'We provide the best experiences for our customers.',
    },
    {
      number: '2',
      title: 'Affordable and reliable services',
      description: 'Experience the best quality at a reasonable price.',
    },
    {
      number: '3',
      title: 'Trusted by thousands',
      description: 'Join the community of happy travelers.',
    },
    {
      number: '4',
      title: 'Wide range of options',
      description: 'From budget-friendly to luxurious travels.',
    },
  ];

  return (
    <motion.section
      className="bg-gray-50 md:pt-16 pt-8 px-4 md:px-8 min-h-screen"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <motion.div
        className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <motion.div
          className="flex justify-between items-start mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ContentDivider
            dividerText="Why Choose Us"
            title1="Your Trusted"
            title2="Partner In Travel"
            description="We are a team of travel experts who are passionate about helping you explore the world."
            titleClass={6}
          />
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row w-full justify-between md:gap-12 gap-8 items-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          {/* Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.6 }}
            className="w-full md:w-1/2 lg:w-1/2"
          >
            <Card className="p-0 group overflow-hidden border-0 transition-all duration-300 w-full">
              <CardContent className="p-0 w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-transparent">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/hero3_img.jpg"
                    alt="Why Choose Us"
                    fill
                    priority={true}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="lg:w-1/2 space-y-8 px-12 md:px-0"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 1 + index * 0.1,
                }}
              >
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
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
