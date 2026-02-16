import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added navigation hooks
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import useAuth from '../hooks/useAuth'; // Import your custom hook

const SocialIcon = ({ icon }) => (
    <button type="button" className="p-3 border-2 border-gray-600 rounded-full text-gray-700 hover:bg-gray-700 hover:text-white transition-all">
        {icon}
    </button>
);

const SignIn = () => {
    const [disabled, setDisabled] = useState(true);
    const { signIn } = useAuth(); // Pull signIn from context
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect user to where they came from, or home page
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
        // Firebase Sign In logic
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log("Logged in user:", user);
                alert("Login Successful!");
                navigate(from, { replace: true }); // Redirect
            })
            .catch(error => {
                console.error(error);
                alert(error.message);
            });
    };

    const handleValidateCaptcha = (e) => {
        const user_captcha_value = e.target.value;
        if (validateCaptcha(user_captcha_value)) {
            setDisabled(false);
        } else {
            setDisabled(true);
            // Optional: alert("Captcha does not match");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign In</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <input
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", { required: "Password is required" })}
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D2B48C] outline-none bg-white"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Captcha Section */}
                <div className="space-y-3">
                    <div className="bg-white border border-gray-300 rounded-md p-2 shadow-inner">
                        <LoadCanvasTemplate />
                    </div>
                    
                    <input
                        type="text"
                        onBlur={handleValidateCaptcha}
                        placeholder="Type the captcha above"
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D2B48C] outline-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    disabled={disabled}
                    type="submit"
                    className={`w-full font-bold py-3 rounded-md transition-all duration-300 shadow-md 
                        ${disabled 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-[#D2B48C] hover:bg-[#BFA37C] text-white active:scale-95'
                        }`}
                >
                    Sign In
                </button>
            </form>

            <div className="mt-8 text-center space-y-4">
                <p className="text-[#D2B48C] font-medium text-sm">
                    New here? <Link to="/signup" className="font-bold hover:underline">Create a New Account</Link>
                </p>
                <p className="text-gray-500 text-sm font-semibold">Or sign in with</p>

                <div className="flex justify-center gap-4">
                    <SocialIcon icon={<FaFacebookF />} />
                    <SocialIcon icon={<FaGoogle />} />
                    <SocialIcon icon={<FaGithub />} />
                </div>
            </div>
        </div>
    );
};

export default SignIn;