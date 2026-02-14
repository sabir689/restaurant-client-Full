import { Swiper, SwiperSlide } from "swiper/react";

// IMPORTANT: Import from swiper/modules for Swiper 9+
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Asset imports
import slide1 from '../../assets/home/slide1.jpg';
import slide2 from '../../assets/home/slide2.jpg';
import slide3 from '../../assets/home/slide3.jpg';
import slide4 from '../../assets/home/slide4.jpg';
import slide5 from '../../assets/home/slide5.jpg';

// Component imports
import SectionTitle from "../../components/SectionTitle";

const Category = () => {
    return (
        <section className=" mx-auto px-4">
            <SectionTitle 
                subHeading={"From 11.00am to 10.00pm"}
                heading={"Order Online"}
            />
            
            <Swiper
                // Default settings (Mobile)
                slidesPerView={2}
                spaceBetween={10}
                centeredSlides={false}
                pagination={{
                    clickable: true,
                }}
                // Breakpoints for different screen sizes
                breakpoints={{
                    // When window width is >= 640px (Tablet)
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    // When window width is >= 1024px (Desktop)
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
                modules={[Pagination]}
                className="mySwiper mb-24"
            >
                <SwiperSlide>
                    <img src={slide1} alt="Salad" className="w-full rounded-lg" />
                    <h3 className="text-xl md:text-4xl uppercase text-center -mt-12 md:-mt-20 text-white drop-shadow-lg shadow-black italic font-medium">
                        Salads
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide2} alt="Pizza" className="w-full rounded-lg" />
                    <h3 className="text-xl md:text-4xl uppercase text-center -mt-12 md:-mt-20 text-white drop-shadow-lg shadow-black italic font-medium">
                        Pizzas
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide3} alt="Soup" className="w-full rounded-lg" />
                    <h3 className="text-xl md:text-4xl uppercase text-center -mt-12 md:-mt-20 text-white drop-shadow-lg shadow-black italic font-medium">
                        Soups
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide4} alt="Dessert" className="w-full rounded-lg" />
                    <h3 className="text-xl md:text-4xl uppercase text-center -mt-12 md:-mt-20 text-white drop-shadow-lg shadow-black italic font-medium">
                        Desserts
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide5} alt="Salad" className="w-full rounded-lg" />
                    <h3 className="text-xl md:text-4xl uppercase text-center -mt-12 md:-mt-20 text-white drop-shadow-lg shadow-black italic font-medium">
                        Salads
                    </h3>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default Category;