import { FaGoogle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2"; // Added for better feedback

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to where the user was going, or home
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    photo: result.user?.photoURL // Nice to have for the profile
                };

                // Post the user to the database
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        console.log("User saved:", res.data);
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: `Welcome, ${result.user?.displayName}!`,
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true
                        });
                        navigate(from, { replace: true });
                    })
                    .catch(err => {
                        // Even if user exists (409 error), we still want to log them in
                        console.log("User might already exist in DB",err);
                        navigate(from, { replace: true });
                    });
            })
            .catch(error => {
                console.error("Google Sign In Error:", error.message);
            });
    };

    return (
        <div className="px-8 pb-8 text-center text-black">
            <div className="divider text-gray-400 text-sm">OR CONTINUE WITH</div>
            <div className="flex justify-center">
                <button 
                    onClick={handleGoogleSignIn} 
                    className="btn btn-outline border-gray-300 hover:bg-[#B58130] hover:border-[#B58130] flex items-center gap-3 px-10 transition-all duration-300"
                >
                    <FaGoogle className="text-xl text-red-500 group-hover:text-white" />
                    <span className="font-bold">Google</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;