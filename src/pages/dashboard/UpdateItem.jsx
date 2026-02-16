import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaUtensils } from "react-icons/fa";
import { useState } from "react";

// Image hosting configuration
const image_hosting_key = import.meta.env.VITE_Image_upload_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItem = () => {
    const item = useLoaderData();
    const { name, category, recipe, price, image, _id } = item;

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: name,
            category: category,
            price: price,
            recipe: recipe
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        let imageUrl = image; // Default to existing image

        // 1. Check if a new image was uploaded
        if (data.image && data.image.length > 0) {
            const imageFile = { image: data.image[0] };
            const res = await axiosPublic.post(image_hosting_api, imageFile, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            if (res.data.success) {
                imageUrl = res.data.data.display_url;
            }
        }

        // 2. Prepare updated item data
        const updatedItem = {
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            recipe: data.recipe,
            image: imageUrl
        };

        // 3. Patch request to backend
        const res = await axiosSecure.patch(`/menu/${_id}`, updatedItem);

        if (res.data.modifiedCount > 0) {
            reset();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.name} is updated successfully!`,
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/dashboard/manageItems');
        } else {
            Swal.fire({
                icon: "info",
                title: "No changes made",
                text: "The item details remain the same."
            });
        }
        setLoading(false);
    };

    return (
        <div className="w-full px-4 md:px-10 pb-10 text-black">
            {/* --- Section Header --- */}
            <div className="text-center my-10">
                <h2 className="text-4xl uppercase border-y-4 py-4 font-semibold">Update Item</h2>
            </div>

            {/* --- Form Container --- */}
            <div className="bg-[#F3F3F3] p-6 md:p-12 rounded-lg shadow-sm border">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Recipe Name Field */}
                    <div className="form-control w-full mb-6">
                        <label className="label">
                            <span className="label-text font-semibold">Recipe name*</span>
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Recipe name"
                            className="input input-bordered w-full h-14 bg-white focus:outline-none focus:border-[#B58130]"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        {/* Category Select Field */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Category*</span>
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="select select-bordered w-full h-14 bg-white focus:outline-none focus:border-[#B58130]"
                            >
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                            </select>
                        </div>

                        {/* Price Input Field */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Price*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("price", { required: true })}
                                placeholder="Price"
                                className="input input-bordered w-full h-14 bg-white focus:outline-none focus:border-[#B58130]"
                            />
                        </div>
                    </div>

                    {/* Recipe Details Textarea Field */}
                    <div className="form-control w-full mb-6">
                        <label className="label">
                            <span className="label-text font-semibold">Recipe Details*</span>
                        </label>
                        <textarea
                            {...register("recipe", { required: true })}
                            className="textarea textarea-bordered h-40 bg-white focus:outline-none focus:border-[#B58130] w-full"
                            placeholder="Tell us more about this recipe..."
                        ></textarea>
                    </div>

                    {/* File Input for optional Image Update */}
                    <div className="form-control w-full mb-6">
                        <label className="label">
                            <span className="label-text font-semibold">Update Image (Optional)</span>
                        </label>
                        <input
                            {...register("image")}
                            type="file"
                            className="file-input file-input-bordered bg-white w-full max-w-xs focus:outline-none focus:border-[#B58130]"
                        />
                    </div>

                    {/* Submit Button with Gold Gradient */}
                    <div className="text-center mt-8">
                        <button 
                            disabled={loading}
                            className="btn bg-gradient-to-r from-[#835D23] to-[#B58130] border-none text-white px-12 h-14 hover:opacity-90 transition-opacity uppercase font-bold"
                        >
                            {loading ? "Updating..." : "Update Menu Item"} <FaUtensils className="ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateItem;