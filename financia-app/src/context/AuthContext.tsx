// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";

interface Tokens {
  access: string;
  refresh: string;
}
interface User {
  id: number;
  username: string;
  email: string;
}
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Tiny JWT decoder to extract the “exp” field
function parseJwt(token: string): { exp?: number } | null {
  try {
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Tokens | null>(() => {
    const stored = localStorage.getItem("tokens");
    return stored ? JSON.parse(stored) : null;
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuthHeader = (accessToken?: string) => {
    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("tokens");
    setTokens(null);
    setUser(null);
    setAuthHeader();
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      if (!tokens?.access) {
        handleLogout();
      } else {
        const payload = parseJwt(tokens.access);
        if (payload?.exp && payload.exp * 1000 > Date.now()) {
          // Access token valid
          setAuthHeader(tokens.access);
          const res = await axios.get<User>("/api/auth/profile/");
          setUser(res.data);
        } else if (tokens.refresh) {
          // Try refresh
          try {
            const r = await axios.post<{ access: string }>(
              "/api/auth/refresh/",
              { refresh: tokens.refresh }
            );
            const newTokens = { access: r.data.access, refresh: tokens.refresh };
            setTokens(newTokens);
            localStorage.setItem("tokens", JSON.stringify(newTokens));
            setAuthHeader(newTokens.access);

            const pr = await axios.get<User>("/api/auth/profile/");
            setUser(pr.data);
          } catch {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [tokens, handleLogout]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await axios.post<Tokens>("/api/auth/login/", {
        username: email,
        password,
      });
      setTokens(res.data);
      localStorage.setItem("tokens", JSON.stringify(res.data));
      setAuthHeader(res.data.access);

      const pr = await axios.get<User>("/api/auth/profile/");
      setUser(pr.data);
    },
    []
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await axios.post("/api/auth/register/", { username, email, password });
    },
    []
  );

  const logout = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// at the very bottom of src/context/AuthContext.tsx

/**
 * A convenient hook to access your auth context.
 * Will throw if you forget to wrap your tree in <AuthProvider>.
 */
export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
