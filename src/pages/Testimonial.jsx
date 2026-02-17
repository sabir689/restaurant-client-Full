import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/reviews')
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error("Error fetching reviews:", err));
    }, []);

    return (
        <section className="my-20 max-w-screen-xl mx-auto px-4">
            <SectionTitle
                subHeading="What Our Clients Say"
                heading="TESTIMONIALS"
            />

            <Swiper
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
            >
                {reviews.map(review => (
                    <SwiperSlide key={review._id}>
                        <div className="flex flex-col items-center mx-16 md:mx-32 my-10 text-center space-y-4">
                            
                            {/* 1. Star Rating */}
                            <Rating
                                style={{ maxWidth: 180 }}
                                value={review.rating}
                                readOnly
                            />

                            {/* 2. Quote Icon */}
                            <FaQuoteLeft className="text-6xl md:text-8xl text-[#151515] my-4" />

                            {/* 3. Dish Name (Added based on your new data) */}
                            <h4 className="text-xl font-bold text-[#D1A054] uppercase font-cinzel">
                                {review.name}
                            </h4>

                            {/* 4. Review Details */}
                            <p className="text-gray-600 text-lg italic leading-relaxed px-4">
                                "{review.details}"
                            </p>

                            {/* 5. Reviewer Name (Using userName from your data) */}
                            <div className="pt-4">
                                <h3 className="text-2xl text-orange-500 font-medium uppercase tracking-wider">
                                    {review.userName || "Anonymous Guest"}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(review.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Loading State */}
            {reviews.length === 0 && (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-warning"></span>
                </div>
            )}
        </section>
    );
};

export default Testimonials;