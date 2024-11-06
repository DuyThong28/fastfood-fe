import authService from "@/services/auth.service";
import throttle from "lodash.throttle";
import Axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "universal-cookie";
import { routes } from "@/config";
const cookies = new Cookies();


const URL_SERVER = import.meta.env.VITE_URL_SERVER;
export const getAccessToken = () => {
  return cookies.get("access_token");
};
export const setAccessToken = (token: string) => {
  cookies.set("access_token", token, { path: "/" });
};
export const removeAccessToken = () => {
  cookies.remove("access_token", { path: '/' });
};
const refreshAccessToken = throttle(
  async (originalRequest) => {
    try {
      const newToken = await authService.refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Refresh token expired or invalid. Logging out",
        refreshError,
      );
      removeAccessToken();
      window.location.href = routes.AUTH.SIGN_IN;
    }
  },
  1000,
  {
    leading: true,
    trailing: false,
  },
);

function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (config.headers) {
    config.headers.Accept = "application/json";

    const token = getAccessToken();
    console.log("get access token twice", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: URL_SERVER,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops
      await refreshAccessToken(originalRequest);
    }

    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          console.error("Bad Request:", error.response);
          break;
        case 404:
          console.error("Resource not found: /not-found", error.response);
          break;
        case 500:
          console.error("Server error: /server-error", error.response);
          break;
        default:
          console.error("An unknown error occurred:", error.response);
      }
    } else {
      console.error("Network or CORS issue:", error.message);
    }

    return Promise.reject(error);
  },
);
