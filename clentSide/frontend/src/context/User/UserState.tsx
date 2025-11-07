import React, { useContext, useState, type ReactNode } from "react";
import UserContext, { type UserContextType } from "./UserContext";
import AuthContext, { type AuthData } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import useJwtInterceptors from "../../Hooks/useJwtInterceptors";
import AlertContext from "../Alert/AlertContext";
import { axiosInstance } from "../../api/axios";

interface UserStateProps {
  children: ReactNode;
}

const UserState: React.FC<UserStateProps> = ({ children }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const axiosPrivateInstance = useJwtInterceptors();

  const SignUp = async (name: string, phone: string, password: string) => {
    try {
      const response = await axiosPrivateInstance.post("/api/auth/createuser", {
        name,
        phone,
        password,
      });

      if (!response) {
        showAlert("User creation failed. Please try again later.", "danger");
        navigate("/home");
        return;
      }

      const id = response?.data?.user?._id;
      setAuth({ id } as AuthData);
      showAlert(response?.data?.message, "success");
      navigate("/logIn");
    } catch (error: any) {
      if (!error?.response) {
        showAlert("No response from the server", "danger");
      } else if (error.response.status === 500) {
        showAlert("User was not created, try again", "danger");
      } else if (error.response.status === 402) {
        showAlert("Please login with correct credentials", "danger");
      } else if (error.response.status === 400) {
        showAlert("User with the same email exists", "danger");
      }
    }
  };

  const logIn = async (phone: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        phone,
        password,
      });
      console.log(response);
      const { user } = response.data;
      const { accessToken, refreshToken } = response.data;
      setAuth({ user, accessToken, refreshToken } as AuthData);
      showAlert(response?.data?.message, "success");
      navigate("/home");
    } catch (error: any) {
      if (!error?.response) {
        showAlert("No response from the server", "danger");
      } else if (error.response.status === 400) {
        showAlert("No user found", "danger");
      } else if (error.response.status === 401) {
        showAlert("Please login with correct credentials", "danger");
      }
    }
  };

  const getMe = async () => {
    try {
      const response = await axiosPrivateInstance.post("/api/auth/getMe");
      const { user } = response.data;
      setUser(user);
      showAlert("data fetched", "success");
    } catch (error: any) {
      if (!error?.response) {
        showAlert("No response from the server", "danger");
      } else if (error.response.status === 400) {
        showAlert("No user found", "danger");
      } else if (error.response.status === 401) {
        showAlert("Please login with correct credentials", "danger");
      }
    }
  };

  const logout = async () => {
    try {
      await axiosPrivateInstance.post("/api/auth/logout");
      setAuth({});
      setCart([]);
      setProducts([]);
      setReload(false);
      setLimit(5);
      localStorage.removeItem("auth");
      localStorage.removeItem("persist");
      navigate("/login");
      showAlert("Logged out successfully", "success");
    } catch (error: any) {
      console.error(error);
      showAlert(error?.response?.data?.message || "Logout failed", "danger");
    }
  };

  const value: UserContextType = {
    SignUp,
    logIn,
    logout,
    getMe,
    user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserState;
