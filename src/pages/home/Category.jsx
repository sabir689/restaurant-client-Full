import { Swiper, SwiperSlide } from "swiper/react";

// IMPORTANT: Change the import source for Pagination
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
        <section className="max-w-screen-xl mx-auto">
            <SectionTitle 
                subHeading={"From 11.00am to 10.00pm"}
                heading={"Order Online"}
            />
            
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                centeredSlides={true}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper mb-24"
            >
                <SwiperSlide>
                    <img src={slide1} alt="Salad" className="w-full" />
                    <h3 className="text-4xl uppercase text-center -mt-16 text-white drop-shadow-lg shadow-black">
                        Salads
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide2} alt="Pizza" className="w-full" />
                    <h3 className="text-4xl uppercase text-center -mt-16 text-white drop-shadow-lg shadow-black">
                        Pizzas
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide3} alt="Soup" className="w-full" />
                    <h3 className="text-4xl uppercase text-center -mt-16 text-white drop-shadow-lg shadow-black">
                        Soups
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide4} alt="Dessert" className="w-full" />
                    <h3 className="text-4xl uppercase text-center -mt-16 text-white drop-shadow-lg shadow-black">
                        Desserts
                    </h3>
                </SwiperSlide>
                
                <SwiperSlide>
                    <img src={slide5} alt="Salad" className="w-full" />
                    <h3 className="text-4xl uppercase text-center -mt-16 text-white drop-shadow-lg shadow-black">
                        Salads
                    </h3>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default Category;