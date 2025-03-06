import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth"; // Import User type

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // Allow user to be User or null
  const [loading, setLoading] = useState(true); // Loading state initialized to true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser can be User or null
      setLoading(false); // Once the user state is resolved, we disable loading
    });
    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  return { user, loading };
};