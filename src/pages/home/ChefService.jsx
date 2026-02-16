import React from 'react';
import chefBg from '../../assets/home/chef-service.jpg';

const ChefService = () => {
    return (
        <div 
            className="hero min-h-[500px] bg-fixed mb-20" 
            style={{ backgroundImage: `url(${chefBg})` }}
        >
            <div className="hero-overlay bg-opacity-30"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-4xl bg-white/60 text-black py-12 px-8 md:px-24 shadow-2xl">
                    <h2 className="mb-5 text-4xl md:text-5xl font-cinzel uppercase">
                        Bistro Boss
                    </h2>
                    <p className="mb-5 leading-relaxed">
                        Welcome to Bistro Boss, where culinary excellence meets casual elegance. 
                        Our chefs craft unforgettable dishes using only the finest farm-fresh 
                        ingredients with a modern twist on timeless classics. Whether you are 
                        joining us for a family dinner or a romantic evening, we promise a 
                        unique dining experience that satisfies every palate.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChefService;