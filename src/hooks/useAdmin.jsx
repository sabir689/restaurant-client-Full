import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


const useAdmin = () => {
    const { user, loading } = useAuth(); // Destructure loading as well
    const axiosSecure = useAxiosSecure();
    
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        // This is the important part!
        enabled: !loading && !!user?.email, 
        queryFn: async () => {
            console.log('asking axiosSecure about admin status', user.email);
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            return res.data?.admin;
        }
    })
    return [isAdmin, isAdminLoading]
};
export default useAdmin;