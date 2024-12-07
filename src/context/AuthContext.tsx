import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { api } from "../api/client";
import { User, LoginCredentials } from "../types";
import { cache } from "../utils/cache";

// Define the AuthContext interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Initialize context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on initial load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Handle login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setError(null); // Clear any existing error
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
      throw err; // Allow the calling component to handle further
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    cache.clear();
    setError(null); // Clear any existing error
  }, []);

  // Clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, loading, error, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
