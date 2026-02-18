import { useEffect, useState } from "react";
import { 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from "firebase/auth";
import axios from "axios"; 
import { auth } from "../firebase/Firebase.init"; 
import { AuthContext } from "../context/AuthContext"; 

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, 
            photoURL: photo
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Get token and store in client side
                const userInfo = { email: currentUser.email };
                try {
                    const res = await axios.post('https://restaurant-server-eta.vercel.app/jwt', userInfo);
                    if (res.data.token) {
                        localStorage.setItem('access-token', res.data.token);
                        // We set loading to false ONLY after the token is saved
                        setLoading(false);
                    }
                } catch (err) {
                    console.error("JWT Error at AuthProvider:", err);
                    localStorage.removeItem('access-token');
                    setLoading(false);
                }
            } else {
                // Remove token (if user logs out)
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;