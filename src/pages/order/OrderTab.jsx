import FoodCard from '../order/FoodCard';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; 
import { Helmet } from 'react-helmet-async';


import "swiper/css";
import "swiper/css/pagination";

const OrderTab = ({ items }) => {
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };

    return (
        <div className="w-full">
            <Helmet>
                <title>Bistro Boss | Order</title>
            </Helmet>
            
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                className="mySwiper pb-12" 
            >
                <SwiperSlide>
                   
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center'>
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