import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import SocialLogin from './SocialLogin';


const SignIn = () => {
    const [disabled, setDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, []);

    const onSubmit = (data) => {
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                Swal.fire({
                    position: "top-end",
                    title: `Welcome back, ${user?.displayName || 'User'}!`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Error',
                    text: "Invalid email or password",error
                });
            });
    };

    const handleValidateCaptcha = (e) => {
        const user_captcha_value = e.target.value;
        if (validateCaptcha(user_captcha_value)) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-10 ">
            <Helmet>
                <title>Bistro da unique | Sign In</title>
            </Helmet>
            
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 uppercase font-cinzel">Sign In</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 md:px-0">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Type here"
                        {...register("email", { required: "Email is required" })}
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D2B48C] outline-none bg-white"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D2B48C] outline-none bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-[#D2B48C]"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Captcha */}
                <div className="space-y-3">
                    <div className="bg-white border border-gray-300 rounded-md p-2 shadow-inner overflow-hidden">
                        <LoadCanvasTemplate />
                    </div>
                    <input
                        type="text"
                        onBlur={handleValidateCaptcha}
                        placeholder="Type the captcha above"
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D2B48C] outline-none"
                    />
                </div>

                <button
                    disabled={disabled}
                    type="submit"
                    className={`w-full font-bold py-3 rounded-md transition-all duration-300 shadow-md uppercase
                        ${disabled 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-[#D2B48C] hover:bg-[#BFA37C] text-white active:scale-95'
                        }`}
                >
                    Sign In
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-[#D2B48C] font-medium text-sm mb-4">
                    New here? <Link to="/signup" className="font-bold hover:underline">Create a New Account</Link>
                </p>
                
                {/* 2. Replace manual icons with the SocialLogin component */}
                <SocialLogin />
            </div>
        </div>
    );
};

export default SignIn;