import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const SocialIcon = ({ icon }) => (
    <button className="p-3 border-2 border-gray-600 rounded-full text-gray-700 hover:bg-gray-700 hover:text-white transition-all">
        {icon}
    </button>
);

const SignUp = () => {
    // Fixed: Destructured the functions needed from your AuthContext
    const { createUser, updateUserProfile } = useAuth();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = (data) => {
        // 1. Create the user in Firebase
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);

                // 2. Update the user's profile with their Name
                updateUserProfile(data.name)
                    .then(() => {
                        console.log('User profile info updated');
                        reset(); // Clear the form
                        alert("Registration Successful!");
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => {
                console.error(error);
                alert(error.message);
            });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign Up</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Type here"
                        {...register("name", { required: "Name is required" })}
                        className={`w-full text-black px-4 py-3 border rounded-md outline-none focus:ring-1 focus:ring-amber-500 bg-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Type here"
                        {...register("email", { required: "Email is required" })}
                        className={`w-full text-black px-4 py-3 border rounded-md outline-none focus:ring-1 focus:ring-amber-500 bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", { 
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                            pattern: {
                                value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                                message: "Password must have uppercase, lowercase, number and special characters"
                            }
                        })}
                        className={`w-full text-black px-4 py-3 border rounded-md outline-none focus:ring-1 focus:ring-amber-500 bg-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#D2B48C] hover:bg-[#BFA37C] text-white font-bold py-3 rounded-md shadow-md transition-all active:scale-95"
                >
                    Sign Up
                </button>
            </form>

            <div className="mt-6 text-center space-y-4">
                <p className="text-[#D2B48C] font-semibold text-sm">
                    Already registered? <Link to="/signIn" className="font-bold hover:underline">Go to log in</Link>
                </p>
                <p className="text-gray-500 text-sm font-semibold">Or sign up with</p>
                
                <div className="flex justify-center gap-4">
                    <SocialIcon icon={<FaFacebookF />} />
                    <SocialIcon icon={<FaGoogle />} />
                    <SocialIcon icon={<FaGithub />} />
                </div>
            </div>
        </div>
    );
};

export default SignUp;