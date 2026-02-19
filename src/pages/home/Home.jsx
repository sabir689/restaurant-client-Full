
import Banner from './Banner';
import Category from './Category';
import ChefService from './ChefService';
import PopularMenu from './PopularMenu';
import Featured from './Featured';
import ChefRecommends from './ChefRecommends';
import Testimonials from '../Testimonial';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div >
            <Helmet>
                <title>Bistro da unique | Home</title>
                <meta name="description" content="Welcome to Bistro da unique Restaurant - The best food in town" />
            </Helmet>
            
           <div className='mt-20'>
             <Banner></Banner>
           </div>
            <Category></Category>
            <ChefService></ChefService>
            <PopularMenu></PopularMenu>
            <section className="max-w-screen-xl mx-auto my-20">
                <div className="bg-black text-white text-center py-16 md:py-24 rounded-sm">
                    <h2 className="text-3xl md:text-5xl font-semibold font-cinzel">
                        Call Us: +88 01987909334
                    </h2>
                </div>
            </section>
             <ChefRecommends></ChefRecommends>
            <Featured></Featured>
            <Testimonials></Testimonials>
            
        </div>
    );
};

export default Home;