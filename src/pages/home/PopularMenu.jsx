import SectionTitle from "../../components/SectionTitle";
import MenuItem from "../../pages/shared/MenuItem";
import useMenu from "../../hooks/UseMenu";
import { Link } from 'react-router-dom';

const PopularMenu = () => {
    const [menu] = useMenu();
    const popular = menu.filter(item => item.category === 'popular');
    
    return (
        /* Added max-w-7xl and mx-auto to keep the section centered and clean */
        <section className="mb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <SectionTitle
                heading="From Our Menu"
                subHeading="Popular Items"
            />
            
            {/* 1. grid-cols-1: Single column for mobile.
                2. lg:grid-cols-2: Two columns for desktop.
                3. gap-y-8: Extra vertical space between items on mobile.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-12">
                {
                    popular.map(item => <MenuItem
                        key={item._id}
                        item={item}
                    />)
                }
            </div>

            <div className="flex items-center justify-center mt-12">
               <Link to='/menu'>
                    <button className="btn btn-outline border-0 border-b-4 uppercase transition-all hover:bg-slate-900 hover:text-white hover:border-yellow-400">
                        View Full Menu
                    </button>
               </Link>
            </div>
        </section>
    );
};

export default PopularMenu;