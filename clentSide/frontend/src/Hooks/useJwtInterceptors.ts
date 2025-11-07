import axios from "axios";
import { useContext } from "react";
import { axiosPrivate } from "../api/axios";
import AuthContext from "../context/Auth/AuthContext";
import useRefresh from "./useRefresh";
const useJwtInterceptors = () => {
  const { auth } = useContext(AuthContext);
  const refresh = useRefresh();

  axiosPrivate.interceptors.request.use(async (config) => {
    const accessToken = auth?.accessToken;

    if (!config.headers.Authorization && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  axiosPrivate.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const prevRequest = error?.config;
      if (
        error?.response?.status === 403 ||
        prevRequest.headers.Authorization === "Bearer undefined"
      ) {
        try {
          const accessToken = await refresh();
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(prevRequest);
        } catch (refreshError) {
          console.error("Refresh token error:", refreshError);
          return Promise.reject(refreshError);
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return axiosPrivate;
};

export default useJwtInterceptors;
