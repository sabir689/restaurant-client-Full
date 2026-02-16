import { Parallax } from 'react-parallax';
import imgbanner from '../../assets/menu/banner3.jpg';

const Cover = ({ img, title }) => {
    const displayImg = title === "our menu" ? imgbanner : img;

    return (
        <Parallax
            blur={{ min: -25, max: 25 }}
            bgImage={displayImg}
            bgImageAlt="the menu"
            strength={-200}
        >
            {/* Height: 450px on mobile, 600px on desktop */}
            <div className="hero h-[450px] md:h-[600px]">
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content w-full px-4">
                    {/* Width: Full on mobile, max-w-4xl on desktop
                        Padding X: 10 on mobile, 20 on tablet, 60 on desktop
                        Padding Y: 10 on mobile, 20 on desktop
                    */}
                    <div className="bg-black/60 px-10 md:px-20 lg:px-60 py-10 md:py-20 w-full max-w-4xl">
                        <h1 className="mb-5 text-4xl md:text-6xl lg:text-7xl font-bold uppercase font-cinzel">
                            {title}
                        </h1>
                        <p className="mb-5 uppercase text-sm md:text-base">
                            Would you like to try a dish?
                        </p>
                    </div>
                </div>
            </div>
        </Parallax>
    );
};

export default Cover;