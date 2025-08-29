import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import * as motion from 'motion/react-client';

export default function Footer() {
  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero3_img.jpg')`,
        }}
      />
      {/* Gradient Overlay - White to Transparent */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/60 to-transparent" />
      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      >
        {/* Small Label */}
        <motion.p
          className="text-gray-600 text-lg mb-4 font-medium"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
        >
          Begin your journey
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
        >
          Let's Just Get Travel
          <br />
          Around The World
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-700 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.9 }}
        >
          Ready to turn your dreams into reality? Get in touch with us today and
          let's start planning your next adventure!
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
        >
          <Button
            variant="default"
            className="bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl py-6 px-16"
          >
            <Link href="/travel-packages">Join the Trip</Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
