import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className="flex flex-col md:flex-row text-white">
                {/* Contact Us Section */}
                <div className="bg-[#1F2937] w-full md:w-1/2 p-10 md:p-20 flex flex-col items-center md:items-end">
                    <div className="text-center md:text-right md:mr-20">
                        <h3 className="text-3xl mb-6 uppercase font-medium">Contact Us</h3>
                        <div className="space-y-2 text-lg">
                            <p>123 ABS Street, Uni 21, Bangladesh</p>
                            <p>+88 123456789</p>
                            <p>Mon - Fri: 08:00 - 22:00</p>
                            <p>Sat - Sun: 10:00 - 23:00</p>
                        </div>
                    </div>
                </div>

                {/* Follow Us Section */}
                <div className="bg-[#111827] w-full md:w-1/2 p-10 md:p-20 flex flex-col items-center md:items-start">
                    <div className="text-center md:text-left md:ml-20">
                        <h3 className="text-3xl mb-6 uppercase font-medium">Follow Us</h3>
                        <p className="text-lg mb-6">Join us on social media</p>
                        <div className="flex gap-6 text-3xl">
                            <a href="#" className="hover:text-yellow-500 transition-colors">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="hover:text-yellow-500 transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="#" className="hover:text-yellow-500 transition-colors">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#151515] text-white text-center py-4">
                <p>Copyright © {currentYear} Bistro Boss. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;