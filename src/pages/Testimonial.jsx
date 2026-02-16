import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

// Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Swiper required modules
import { Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Rating components and styles
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

// Font Awesome for the quote icon
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
                {
                    reviews.map(review => (
                        <SwiperSlide key={review._id}>
                            <div className="flex flex-col items-center mx-16 md:mx-24 my-10 text-center space-y-6">
                                {/* Star Rating */}
                                <Rating
                                    style={{ maxWidth: 180 }}
                                    value={review.rating}
                                    readOnly
                                />
                                
                                {/* Large Quote Icon */}
                                <FaQuoteLeft className="text-6xl md:text-8xl text-black mt-4" />
                                
                                {/* Review Text */}
                                <p className="text-white text-lg leading-relaxed">
                                    {review.details}
                                </p>
                                
                                {/* Reviewer Name */}
                                <h3 className="text-2xl text-orange-400 font-medium uppercase">
                                    {review.name}
                                </h3>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            {/* Empty State */}
            {reviews.length === 0 && (
                <div className="text-center py-10">
                    <span className="loading loading-spinner loading-lg text-warning"></span>
                </div>
            )}
        </section>
    );
};

export default Testimonials;