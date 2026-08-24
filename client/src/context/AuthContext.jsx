import { createContext, useCallback, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      const profile = response.data || response;
      setUser(profile);
      return profile;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw error;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchProfile();
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [fetchProfile]);

  const register = async (userData) => {
    return authService.register(userData);
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const token = response.data?.token || response.token;

    if (!token) {
      throw new Error(
        "Login successful but authentication token was not returned.",
      );
    }

    localStorage.setItem("token", token);

    if (response?.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    } else {
      await fetchProfile();
    }

    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    fetchProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

