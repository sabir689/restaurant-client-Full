import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { AuthContext } from '../context/AuthContext';

const SocialIcon = ({ icon }) => (
    <button type="button" className="p-3 border-2 border-gray-600 rounded-full text-gray-700 hover:bg-gray-700 hover:text-white transition-all">
        {icon}
    </button>
);

const SignUp = () => {
    const axiosPublic = useAxiosPublic();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // UI & Upload States
    const [profilePic, setProfilePic] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    // Image Upload Logic to ImgBB
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', image);
        
        try {
            const ImageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_upload_Key}`;
            const res = await axios.post(ImageUploadUrl, formData);
            if (res.data.success) {
                setProfilePic(res.data.data.url);
            }
        } catch (error) {
            console.error("Upload error", error);
            Swal.fire("Upload Failed", "Could not upload image. Check your API key.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data) => {
        // Prevent submission if image is still uploading
        if (isUploading) return;

        try {
            // 1. Create User in Firebase
            await createUser(data.email, data.password);
            
            // 2. Update Firebase Profile with Name and ImgBB URL
            await updateUserProfile(data.name, profilePic);

            // 3. Prepare data for your MongoDB
            const userInfo = {
                name: data.name,
                email: data.email,
                image: profilePic,
                role: 'user', // Default role
                createdAt: new Date().toISOString()
            };

            // 4. Sync with Backend Database
            const res = await axiosPublic.post('/users', userInfo);
            
            if (res.data.insertedId) {
                reset();
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Account Created Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            }
        } catch (error) {
            console.error("Auth Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Error',
                text: error.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-10 px-4">
            
            
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign Up</h2>

            {/* Avatar Preview */}
            <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-[#D2B48C] relative overflow-hidden shadow-sm">
                    {profilePic ? (
                        <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="loading loading-spinner loading-sm text-white"></span>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Profile Picture Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D2B48C] file:text-white hover:file:bg-[#BFA37C] cursor-pointer"
                    />
                </div>

                {/* Name Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Your Name"
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
                        placeholder="email@example.com"
                        {...register("email", { 
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                        })}
                        className={`w-full text-black px-4 py-3 border rounded-md outline-none focus:ring-1 focus:ring-amber-500 bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field with Eye Toggle */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" },
                                pattern: {
                                    value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                                    message: "Must include Uppercase, Lowercase, Number & Special Character"
                                }
                            })}
                            className={`w-full text-black px-4 py-3 border rounded-md outline-none focus:ring-1 focus:ring-amber-500 bg-white pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#BFA37C]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-[#D2B48C] hover:bg-[#BFA37C] text-white font-bold py-3 rounded-md shadow-md transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isUploading ? "Uploading Image..." : "Sign Up"}
                </button>
            </form>

            <div className="mt-6 text-center space-y-4">
                <p className="text-[#D2B48C] font-semibold text-sm">
                    Already registered? <Link to="/login" className="font-bold hover:underline text-[#8B6F47]">Go to log in</Link>
                </p>
                <p className="text-gray-400 text-sm">Or sign up with</p>
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