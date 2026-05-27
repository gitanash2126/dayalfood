import { createContext, useContext, useState, useEffect } from "react";

import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ==========================================
  // USER STATE
  // ==========================================
  const [user, setUser] = useState(null);

  // ==========================================
  // LOADING STATE
  // ==========================================
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER ON APP START
  // ==========================================
  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // FETCH PROFILE
  // ==========================================
  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/profile");

      // SET USER
      setUser(data.data || data.user);
    } catch (error) {
      console.log(error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async () => {
    await fetchProfile();
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    setUser(null);
  };

  // ==========================================
  // ADMIN CHECK
  // ==========================================
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

// ==========================================
// CUSTOM HOOK
// ==========================================
export function useAuth() {
  return useContext(AuthContext);
}
