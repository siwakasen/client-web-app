import React from 'react';
import { Star } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Manager() {
  return (
    <motion.div
      className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            Meet Our Manager
          </motion.h2>

          {/* Profile Section */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          >
            {/* Profile Image with Star Badge */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 }}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src="images/profile2.jpg"
                  alt="Manager"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Star Badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
              >
                <Star className="w-6 h-6 text-white fill-current" />
              </motion.div>
            </motion.div>

            {/* Name and Title */}
            <motion.h3
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
            >
              Ms. Hanna
            </motion.h3>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 1.1 }}
            >
              Manager
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.3 }}
            >
              With over 15 years of industry experience, Hanna leads our company
              with vision and innovation. His commitment to excellence and
              sustainable practices has transformed how we approach business in
              the modern era.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Divider Line */}
        <motion.div
          className="w-24 h-0.5 bg-gray-300 mx-auto mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.5 }}
        ></motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 text-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.7 }}
        >
          {/* Years Experience */}
          <motion.div
            className="py-8 border-b md:border-b-0 border-gray-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1.9 }}
          >
            <motion.div
              className="text-5xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 2.1 }}
            >
              15+
            </motion.div>
            <div className="text-gray-600 text-lg">Years Experience</div>
          </motion.div>

          {/* Projects Completed */}
          <motion.div
            className="py-8 border-b md:border-b-0 md:border-l md:border-r border-gray-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 2.3 }}
          >
            <motion.div
              className="text-5xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 2.5 }}
            >
              200+
            </motion.div>
            <div className="text-gray-600 text-lg">Projects Completed</div>
          </motion.div>

          {/* Global Partners */}
          <motion.div
            className="py-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 2.7 }}
          >
            <motion.div
              className="text-5xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 2.9 }}
            >
              50+
            </motion.div>
            <div className="text-gray-600 text-lg">Global Partners</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
