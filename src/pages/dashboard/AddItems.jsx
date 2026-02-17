import { useForm } from "react-hook-form";
import { FaUtensils, FaPlusCircle } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useState } from "react";

const image_hosting_key = import.meta.env.VITE_Image_upload_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddItem = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const imageFile = { image: data.image[0] };
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: { 'content-type': 'multipart/form-data' }
        });

        if (res.data.success) {
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                image: res.data.data.display_url 
            };

            const menuRes = await axiosSecure.post('/menu', menuItem);
            if (menuRes.data.insertedId) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${data.name} is added to the menu.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
        setLoading(false);
    };

    return (
        <div className="w-full min-h-screen pb-20 px-4 md:px-10 text-black">
            {/* --- Unique Header Section --- */}
            <div className="relative pt-10 mb-12 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
                    <FaUtensils size={200} />
                </div>
                <div className="text-center relative z-10">
                    <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-sm block mb-3">
                        Inventory Management
                    </span>
                    <h2 className="text-5xl font-cinzel font-black text-gray-800 uppercase tracking-tight">
                        Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835D23] to-[#B58130]">New Item</span>
                    </h2>
                    <div className="flex justify-center mt-4">
                        <div className="h-1 w-20 bg-orange-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* --- Form Wrapper with Glassmorphism/Depth --- */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-[#E8E8E8] p-8 md:p-16 rounded-[2rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/20">
                    
                    <div className="mb-10 flex items-center gap-4 text-gray-700 border-b border-gray-300 pb-4">
                        <FaPlusCircle className="text-2xl text-[#835D23]" />
                        <h3 className="text-xl font-bold uppercase tracking-wider">Item Details</h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Recipe Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700 mb-2">Recipe name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sizzling Gambas"
                                {...register("name", { required: true })}
                                className="input h-14 input-bordered bg-white focus:outline-[#B58130] border-none shadow-inner w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Category */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700 mb-2">Category  </span>
                                </label>
                                <select
                                    defaultValue="default"
                                    {...register("category", { required: true })}
                                    className="select select-bordered h-14 bg-white border-none shadow-inner w-full"
                                >
                                    <option disabled value="default">Select a category</option>
                                    <option value="salad">Salad</option>
                                    <option value="pizza">Pizza</option>
                                    <option value="soup">Soup</option>
                                    <option value="dessert">Dessert</option>
                                    <option value="drinks">Drinks</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700 mb-2">Price</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("price", { required: true })}
                                    className="input h-14 input-bordered bg-white border-none shadow-inner w-full"
                                />
                            </div>
                        </div>

                        {/* Recipe Details */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700 mb-2">Recipe Description</span>
                            </label>
                            <textarea
                                {...register("recipe", { required: true })}
                                className="textarea textarea-bordered h-32 bg-white border-none shadow-inner w-full text-base"
                                placeholder="Describe the flavors, ingredients, and presentation..."
                            ></textarea>
                        </div>

                        {/* File Input */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700 mr-5">Upload Image</span>
                            </label>
                            <input
                                {...register("image", { required: true })}
                                type="file"
                                className="file-input bg-white w-full max-w-xs shadow-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                disabled={loading}
                                className="btn px-10 h-16 bg-gradient-to-r from-[#835D23] to-[#B58130] hover:scale-105 transition-transform text-white border-none text-lg rounded-none uppercase font-cinzel tracking-widest"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>Add Item <FaUtensils className="ml-2" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItem;