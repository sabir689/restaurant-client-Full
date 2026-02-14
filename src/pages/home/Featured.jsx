import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import featuredImg from '../../assets/home/featured.jpg';

const Featured = () => {
    return (
        <section 
            // 'bg-fixed' is often disabled on mobile via 'md:bg-fixed' because it causes lag
            className="featured-item bg-fixed text-white pt-8 my-10 md:my-20 bg-slate-700 bg-blend-overlay"
            style={{
                backgroundImage: `url(${featuredImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <SectionTitle 
                subHeading="check it out" 
                heading="Featured Item" 
            />
            
            
            <div className="flex flex-col md:flex-row justify-center items-center  pb-12 md:pb-20 pt-8 md:pt-12 px-6 md:px-36 gap-8 md:gap-12">
                <div className="w-full md:w-1/2">
                    <img 
                        src={featuredImg} 
                        alt="Featured dish" 
                        className="rounded-lg shadow-xl w-full" 
                    />
                </div>
                
                <div className="w-full md:w-1/2 text-center md:text-left space-y-3">
                    <p className="text-lg md:text-xl uppercase">March 20, 2026</p>
                    <p className="uppercase text-xl md:text-2xl font-bold font-cinzel">
                        WHERE CAN I GET SOME?
                    </p>
                    <p className="text-sm md:text-base leading-relaxed opacity-90">
                        Experience our signature dish, crafted with the freshest ingredients 
                        and a passion for culinary excellence. This featured seasonal 
                        special brings together bold flavors and elegant presentation.
                    </p>
                    <button className="btn btn-outline border-0 border-b-4 mt-4 text-white hover:bg-white hover:text-black uppercase">
                        Read More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Featured;