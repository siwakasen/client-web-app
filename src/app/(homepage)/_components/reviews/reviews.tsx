'use client';
import { useEffect, useState } from 'react';
import { useGetRatingsReviews } from '@/hooks/rating.hook';
import { Rating } from '@/interfaces/rating.interface';
import { Star } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Reviews() {
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Using carId 1 as default - you can modify this or make it dynamic
        const response = await useGetRatingsReviews();
        if ('data' in response && Array.isArray(response.data)) {
          console.log('response', response);
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

  if (loading) {
    return (
      <motion.section
        className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8"
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
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            What They Said About Us
          </motion.h2>
          <div className="flex justify-center">
            <div className="text-gray-500">Loading reviews...</div>
          </div>
        </motion.div>
      </motion.section>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.section
        className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8"
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
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            What They Said About Us
          </motion.h2>
          <div className="flex justify-center">
            <div className="text-gray-500">No reviews available yet.</div>
          </div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8"
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
            What They Said About Us
          </motion.h2>
        </motion.div>

        {/* Reviews Grid - Mobile: 3 reviews, MD+: All reviews */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          {/* Mobile: Show only 3 reviews */}
          <div className="md:hidden">
            {reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 0.5 + index * 0.2,
                }}
              >
                {/* Star Rating */}
                <motion.div
                  className="flex items-center mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                    delay: 0.7 + index * 0.2,
                  }}
                >
                  {renderStars(review.service_rate)}
                </motion.div>

                {/* Blockquote */}
                <motion.blockquote
                  className="mt-6 border-l-4 border-gray-300 pl-6 italic text-gray-700 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: 0.8 + index * 0.2,
                  }}
                >
                  &quot;{review.description || 'No description provided.'}&quot;
                </motion.blockquote>
              </motion.div>
            ))}
          </div>

          {/* MD+: Show all reviews */}
          <div className="hidden md:contents">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 0.5 + index * 0.2,
                }}
              >
                {/* Star Rating */}
                <motion.div
                  className="flex items-center mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                    delay: 0.7 + index * 0.2,
                  }}
                >
                  {renderStars(review.service_rate)}
                </motion.div>

                {/* Blockquote */}
                <motion.blockquote
                  className="mt-6 border-l-4 border-gray-300 pl-6 italic text-gray-700 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: 0.8 + index * 0.2,
                  }}
                >
                  &quot;{review.description || 'No description provided.'}&quot;
                </motion.blockquote>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
