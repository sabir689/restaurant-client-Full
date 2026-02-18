import { useEffect, useState, useCallback } from "react";

const useMenu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define the fetch logic as a reusable function
    const refetch = useCallback(() => {
        setLoading(true);
        fetch('https://restaurant-server-eta.vercel.app/menu-all')
            .then(res => res.json())
            .then(data => {
                setMenu(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Global fetch error:", err);
                setLoading(false);
            });
    }, []);

    // Initial load
    useEffect(() => {
        refetch();
    }, [refetch]);

    // Return as array: [0] menu, [1] loading, [2] refetch
    return [menu, loading, refetch]; 
};

export default useMenu;