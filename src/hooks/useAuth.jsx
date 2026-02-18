import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
    const auth = useContext(AuthContext);
    // Safety check: if useAuth is used outside of a provider, this helps debug
    if (!auth) {
        console.error("useAuth must be used within an AuthProvider");
    }
    return auth;
};

export default useAuth;