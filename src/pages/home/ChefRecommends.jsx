import React from 'react';
import SectionTitle from "../../components/SectionTitle";
import useMenu from "../../hooks/UseMenu";

const ChefRecommends = () => {
    const [menu] = useMenu();
    
    // Filter specifically for the 'offered' category
    // We use .slice(0, 3) to ensure we only show 3 items as per the design
    const offeredItems = menu.filter(item => item.category === 'offered').slice(0, 3);

    return (
        <section className="max-w-screen-xl mx-auto my-20 px-4">
            <SectionTitle 
                subHeading="Should Try" 
                heading="CHEF RECOMMENDS" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    offeredItems.map((item) => (
                        <div key={item._id} className="card bg-base-100 shadow-xl rounded-none">
                            <figure>
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-72 object-cover" 
                                />
                            </figure>
                            <div className="card-body items-center text-center bg-[#F3F3F3]">
                                <h2 className="card-title text-gray-600 font-bold text-2xl">{item.name}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2">{item.recipe}</p>
                                <div className="card-actions mt-4">
                                    <button 
                                        className={`btn btn-outline border-0 border-b-4 uppercase transition-all duration-300 ${
                                            
                                            "text-[#BB8506] border-[#BB8506] bg-[#E8E8E8] hover:bg-[#1F2937]"
                                        }`}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            
            {/* Fallback if no items are found */}
            {offeredItems.length === 0 && (
                <p className="text-center text-gray-500 italic">No recommendations available right now.</p>
            )}
        </section>
    );
};

export default ChefRecommends;