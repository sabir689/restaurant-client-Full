import SectionTitle from "../../components/SectionTitle";
import MenuItem from "../../pages/shared/MenuItem";
import useMenu from "../../hooks/UseMenu";


const PopularMenu = () => {
    const [menu] = useMenu();
    const popular = menu.filter(item => item.category === 'popular');
    
    return (
        <section className="m-12">
            <SectionTitle
                heading="From Our Menu"
                subHeading="Popular Items"
            ></SectionTitle>
            <div className="grid md:grid-cols-2  gap-10">
                {
                    popular.map(item => <MenuItem
                        key={item._id}
                        item={item}
                    ></MenuItem>)
                }
            </div>
            <div className="flex items-center justify-center">
                <button className="btn btn-outline  border-0 border-b-4 mt-10">View Full Menu</button>
            </div>
        </section>
    );
};

export default PopularMenu;