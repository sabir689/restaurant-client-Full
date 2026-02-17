import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaStar, FaUtensils, FaQuoteLeft, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const AddReview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, watch } = useForm();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    // Watch for live preview
    const watchDetails = watch("details", "");
    const watchItemName = watch("itemName", "Delicious Food");

    const onSubmit = async (data) => {
        if (rating === 0) {
            return Swal.fire("Rating Required", "Please select at least 1 star.", "warning");
        }

        // Matching your specific database schema
        const reviewInfo = {
            name: data.itemName,   // Maps to your "name" field
            details: data.details, // Maps to your "details" field
            rating: rating,        // Maps to your "rating" field
            userEmail: user?.email,
            userName: user?.displayName,
            date: new Date().toISOString()
        };

        try {
            const res = await axiosSecure.post('/reviews', reviewInfo);
            if (res.data.insertedId) {
                reset();
                setRating(0);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Review Submitted!",
                    showConfirmButton: false,
                    timer: 1500,
                    color: "#D1A054"
                });
            }
        } catch (error) {
            Swal.fire("Error", "Could not save review. Try again.", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F3F3] p-6 lg:p-12 text-black">
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <p className="text-[#D1A054] italic mb-2">---Sharing is Caring---</p>
                    <h2 className="text-4xl font-bold border-y-4 border-gray-200 py-4 uppercase">Give a Review</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Unique Form Card */}
                    <div className="flex-1 bg-white p-10 shadow-2xl rounded-sm border-t-8 border-[#D1A054]">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            
                            {/* Star Rating Selector */}
                            <div className="flex flex-col items-center space-y-3">
                                <p className="font-cinzel font-bold text-xl">Rate Your Experience</p>
                                <div className="flex gap-2">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                className={`text-4xl transition-transform hover:scale-125 ${ratingValue <= (hover || rating) ? 'text-[#D1A054]' : 'text-gray-200'}`}
                                                onClick={() => setRating(ratingValue)}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <FaStar />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dish Name */}
                            <div className="form-control">
                                <label className="label font-bold text-gray-700 uppercase text-xs">Which dish did you enjoy?</label>
                                <input 
                                    {...register("itemName", { required: true })}
                                    className="input input-bordered focus:border-[#D1A054] outline-none rounded-none bg-gray-50"
                                    placeholder="Enter recipe name"
                                />
                            </div>

                            {/* Details */}
                            <div className="form-control">
                                <label className="label font-bold text-gray-700 uppercase text-xs">Share your thoughts</label>
                                <textarea 
                                    {...register("details", { required: true })}
                                    className="textarea textarea-bordered h-32 focus:border-[#D1A054] outline-none rounded-none bg-gray-50"
                                    placeholder="Detailed feedback..."
                                />
                            </div>

                            <button className="btn w-full bg-gradient-to-r from-[#835D23] to-[#B58130] text-white border-none rounded-none flex items-center gap-2 text-lg">
                                Send Review <FaPaperPlane />
                            </button>
                        </form>
                    </div>

                    {/* Aesthetic Card Preview */}
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-[#151515] p-8 rounded-lg shadow-xl text-center text-white relative overflow-hidden">
                            <FaQuoteLeft className="absolute top-4 left-4 text-3xl opacity-20 text-[#D1A054]" />
                            <div className="avatar mb-4">
                                <div className="w-20 rounded-full ring ring-[#D1A054] ring-offset-base-100 ring-offset-2">
                                    <img src={user?.photoURL || "https://i.ibb.co/mJNpy6z/user.png"} alt="user" />
                                </div>
                            </div>
                            <h3 className="font-cinzel text-lg font-bold text-[#D1A054]">{user?.displayName}</h3>
                            <div className="flex justify-center my-3">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < rating ? 'text-[#D1A054]' : 'text-gray-600'} />
                                ))}
                            </div>
                            <p className="font-bold uppercase text-xs text-gray-400 mb-2">{watchItemName}</p>
                            <p className="text-sm italic text-gray-300 leading-relaxed">
                                "{watchDetails.slice(0, 100) || "Your feedback will look like this..."}"
                            </p>
                        </div>
                        <div className="p-4 bg-[#D1A054]/10 border-l-4 border-[#D1A054] rounded-r-lg">
                            <p className="text-xs font-bold text-[#D1A054]">NOTE:</p>
                            <p className="text-[10px] text-gray-600">Your review will be public and helps other foodies choose the best dishes!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReview;