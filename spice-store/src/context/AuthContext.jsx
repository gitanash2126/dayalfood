import { createContext, useContext, useState, useEffect } from "react";

import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // USER
  const [user, setUser] = useState(null);

  // LOADING
  const [loading, setLoading] = useState(true);

  // LOAD USER
  useEffect(() => {
    fetchProfile();
  }, []);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      // NO TOKEN
      if (!token) {
        setLoading(false);

        return;
      }

      // API CALL
      const { data } = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // SET USER
      setUser(data.data || data.user);
    } catch (error) {
      console.log(error);

      // INVALID TOKEN
      localStorage.removeItem("token");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (token) => {
    // SAVE TOKEN
    localStorage.setItem("token", token);

    // FETCH USER
    await fetchProfile();
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  // ADMIN
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        login,

        logout,

        isAdmin,

        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// HOOK
export function useAuth() {
  return useContext(AuthContext);
}
