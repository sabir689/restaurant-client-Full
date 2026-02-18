import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth(); // Destructure loading here

    const { refetch, data: cart = [] } = useQuery({
        queryKey: ['cart', user?.email],
        // CRITICAL FIX: Only run the query if loading is false and user exists
        enabled: !loading && !!user?.email, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?email=${user.email}`);
            return res.data;
        }
    });

    return [cart, refetch];
};

export default useCart;