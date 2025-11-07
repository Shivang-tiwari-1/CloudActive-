import { useState, type ReactNode,  } from "react";
import type { AuthContextType, AuthData } from "./AuthContext";
import AuthContext from "./AuthContext";

interface AuthStateProps {
  children: ReactNode;
}

const AuthState: React.FC<AuthStateProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthData>(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : {};
  });

  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem("persist") || "false")
  );

  const setAuthPersistent: React.Dispatch<React.SetStateAction<AuthData>> = (
    value
  ) => {
    setAuth((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      localStorage.setItem("auth", JSON.stringify(newValue));
      return newValue;
    });
  };

  const value: AuthContextType = {
    auth,
    setAuth: setAuthPersistent,
    persist,
    setPersist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthState;
