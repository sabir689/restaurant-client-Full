import React from 'react';
import { Outlet } from 'react-router-dom';
// Fixed: Variables cannot have hyphens, changed signin-2 to signIn2
import signIn from '../assets/others/authentication.png';
import signIn2 from '../assets/others/authentication2.png';
import Navbar from '../pages/shared/navbar';

const AuthLayOut = () => {
    return (
        
       <div>
        <Navbar></Navbar>
         <div 
            className="min-h-screen flex items-center justify-center bg-gray-100"
            style={{ 
                backgroundImage: `url(${signIn})`, // Using your imported texture/image
                backgroundSize: 'cover' 
            }}
        >
            {/* Main Card Container */}
            <div className="bg-white/80 mt-40 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row w-full max-w-5xl mx-4 overflow-hidden rounded-lg border border-gray-200 mb-20 ">
                
                {/* Left Side: Illustration (Fixed to use your import) */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                    <img 
                        src={signIn2} 
                        alt="Authentication Illustration" 
                        className="max-w-full h-auto"
                    />
                </div>

                {/* Right Side: Dynamic Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
                    <Outlet />
                </div>
            </div>
        </div>
       </div>
    );
};

export default AuthLayOut;