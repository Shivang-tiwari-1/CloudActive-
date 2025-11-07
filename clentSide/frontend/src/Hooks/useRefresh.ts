import { useContext } from "react";
import { axiosInstance } from "../api/axios";
import AuthContext from "../context/Auth/AuthContext";
import AlertContext from "../context/Alert/AlertContext";

const useRefresh = () => {
  const { setAuth } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

  const refresh = async () => {
    try {
      console.log("object");
      const response = await axiosInstance.post(
        "/api/auth/refreshToken",
        {},
        { withCredentials: true }
      );

      if (response.status === 200 && response.data) {
        const { accessToken, refreshToken } = response.data;
        setAuth((prev) => ({ ...prev, accessToken, refreshToken }));
        return accessToken; // important: always return
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error: any) {
      console.error("Refresh token error:", error);
      showAlert("Session expired, please login again", "danger");
      throw error; // ensure failed retry is propagated
    }
  };

  return refresh;
};

export default useRefresh;
