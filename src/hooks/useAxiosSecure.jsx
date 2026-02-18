import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const axiosSecure = axios.create({
    baseURL: 'https://restaurant-server-eta.vercel.app'
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useContext(AuthContext);

    useEffect(() => {
        // 1. Request Interceptor: Add authorization header to every secure call
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access-token');
                if (token) {
                    config.headers.authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 2. Response Interceptor: Handle 401 and 403 errors
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response ? error.response.status : null;
                
                if (status === 401 || status === 403) {
                    await logOut();
                    navigate('/signIn');
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;