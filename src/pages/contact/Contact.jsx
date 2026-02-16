import React from 'react';
import { useForm } from 'react-hook-form';
import { FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import SectionTitle from '../../components/SectionTitle';
import Cover from '../menu/Cover';
import contactImg from '../../assets/contact/banner.jpg';

const Contact = () => {
    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Form submission handler
    const onSubmit = (data) => {
        console.log("Form Data:", data);
        
        alert("Message sent successfully!");
        reset(); 
    };

    return (
        <div >
            <Cover  img={contactImg} title="Contact Us"></Cover>

            <div className=" mx-auto my-20 px-4">
                {/* 1. Location Section */}
                <SectionTitle heading="Visit Us" subHeading="OUR LOCATION" />

                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {/* Phone Card */}
                    <div className="border text-center">
                        <div className="bg-[#D1A054] py-4 flex justify-center text-white text-xl">
                            <FaPhoneAlt />
                        </div>
                        <div className="bg-[#F3F3F3] mx-6 mb-6 py-10 text-black">
                            <h3 className="text-xl font-bold uppercase">Phone</h3>
                            <p>+380023456789</p>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="border text-center">
                        <div className="bg-[#D1A054] py-4 flex justify-center text-white text-xl">
                            <FaMapMarkerAlt />
                        </div>
                        <div className="bg-[#F3F3F3] mx-6 mb-6 py-10 text-black">
                            <h3 className="text-xl font-bold uppercase">Address</h3>
                            <p>123 Street, New York</p>
                        </div>
                    </div>

                    {/* Hours Card */}
                    <div className="border text-center">
                        <div className="bg-[#D1A054] py-4 flex justify-center text-white text-xl">
                            <FaClock />
                        </div>
                        <div className="bg-[#F3F3F3] mx-6 mb-6 py-10 text-black">
                            <h3 className="text-xl font-bold uppercase">Working Hours</h3>
                            <p>Mon - Fri: 08:00 - 22:00</p>
                        </div>
                    </div>
                </div>

                {/* 2. Contact Form Section */}
                <SectionTitle heading="Contact Form" subHeading="Send Us a Message" />

                <div className="bg-[#F3F3F3] p-10 md:p-20 rounded-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Name*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    placeholder="Enter your name"
                                    className={`input input-bordered w-full py-8 ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
                            </div>

                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Email*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email format"
                                        }
                                    })}
                                    placeholder="Enter your email"
                                    className={`input input-bordered w-full py-8 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="form-control mt-6">
                            <label className="label">
                                <span className="label-text font-bold">Phone*</span>
                            </label>
                            <input
                                type="text"
                                {...register("phone", { required: "Phone number is required" })}
                                placeholder="Enter your phone number"
                                className={`input input-bordered w-full py-8 ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
                        </div>

                        {/* Message Textarea */}
                        <div className="form-control mt-6 ">
                            <label className="label">
                                <span className="label-text font-bold">Message*</span>
                            </label>
                            <textarea
                                {...register("message", { required: "Message cannot be empty" })}
                                className={`textarea textarea-bordered h-40 w-full  ${errors.message ? 'border-red-500' : ''}`}
                                placeholder="Write your message here"
                            ></textarea>
                            {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>}
                        </div>

                        <div className="mt-8 text-center">
                            <button 
                                type="submit"
                                className="btn bg-gradient-to-r from-[#835D23] to-[#B58130] text-white px-10 border-none hover:opacity-90 transition-opacity"
                            >
                                Send Message <span className="ml-2">✈️</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;