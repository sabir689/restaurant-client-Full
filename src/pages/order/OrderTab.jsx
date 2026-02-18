import FoodCard from '../order/FoodCard';
import { Swiper, SwiperSlide } from "swiper/react";
// Change this line:
import { Pagination } from "swiper/modules"; 

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Helmet } from 'react-helmet-async';

const OrderTab = ({ items }) => {
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };

    return (
        <div>
            <Helmet>
                            <title>Bistro da unique | Order</title>
                            <meta name="description" content="Welcome to Bistro da unique Restaurant - The best food in town" />
                        </Helmet>
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div className='grid md:grid-cols-3 gap-10'>
                        {
                            items.map(item => <FoodCard
                                key={item._id}
                                item={item}
                            ></FoodCard>)
                        }
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default OrderTab;